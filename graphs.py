import datetime
import satellites
import pandas

today = datetime.date.today()
dates = (today - datetime.timedelta(weeks = i) for i in range(10))

def get():
    for date in dates:
        for satellite in satellites.get_satellites(only_visible = False, now = date):
            yield satellite

df = pandas.DataFrame(list(get()))
for coord in ['longitude', 'latitude']:
    df[coord] = df['position'].map(lambda x: x[coord])
df.to_csv('weekly.csv', index = False)
del df['position']
