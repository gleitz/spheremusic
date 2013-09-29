import datetime
import satellites
import pandas

today = datetime.date.today()
dates = (today - datetime.timedelta(days = i) for i in range(100))

def get():
    for date in dates:
        for satellite in satellites.get_satellites(only_visible = False, now = date):
            yield satellite

df = pandas.DataFrame(list(get()))
