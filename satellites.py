# Symphony of the Satellites
# https://hackpad.com/Symphony-of-the-Satellites-c0aGX4vfmTN

import math
import requests
import ephem
import datetime
from math import degrees
import json
from calendar import timegm

def chunks(l, n):
    """ Yield successive n-sized chunks from l"""
    for i in xrange(0, len(l), n):
        yield l[i:i+n]

def get_satellites():
    SAT_BRIGHTEST = 'http://celestrak.com/NORAD/elements/visual.txt'
    SAT_GEO = 'http://celestrak.com/NORAD/elements/geo.txt'
    SAT_DEBRIS = 'http://celestrak.com/NORAD/elements/1999-025.txt'
    # Fetch the ~100 brightest satellites
    r = requests.get(SAT_DEBRIS)
    data = r.text.split('\r\n')
    # Split each into TLE
    visible = []
    count = 0
    for tle in chunks(data, 3):
        if len(tle) != 3:
            continue
        count += 1
        tle_data = get_location(tle)
        if tle_data['visible']:
            visible.append(tle_data)
    print 'analyzed {0} satellites; found {1} visible'.format(count, len(visible))
    return visible

def get_location(tle, now=None, lat=None, lng=None):
    """Compute the current location of the ISS"""
    now = now or datetime.datetime.utcnow()
    lat = lat or 37.7701
    lng = lng or -122.4664

    satellite = ephem.readtle(str(tle[0]), str(tle[1]), str(tle[2]))

    # Compute for current location
    observer = ephem.Observer()
    observer.lat = lat
    observer.lon = lng
    observer.elevation = 0
    observer.date = now
    satellite.compute(observer)
    lon = degrees(satellite.sublong)
    lat = degrees(satellite.sublat)

    # Return the relevant timestamp and data
    data = {"timestamp": timegm(now.timetuple()),
            "position": {"latitude": lat,
                         "longitude": lon},
            "visible": float(repr(satellite.alt)) > 0 and float(repr(satellite.alt)) < math.pi,
            "range": satellite.range,
            "velocity": satellite.range_velocity}
    return data

