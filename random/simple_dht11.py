import RPi.GPIO as IO
import time
import sys
import Adafruit_DHT

dht11_sensor = Adafruit_DHT.DHT11
# BCM mode addressing GPIO20 which is actually pin38
input_pin = 20

while True:
    try:
        # reads input of dht11 humidity and temperature sensor
        humidity, temperature = Adafruit_DHT.read_retry(
            dht11_sensor, input_pin)
        # prints the humidity and temperature
        print(u'Temperature: {0:0.1f}\u2070C  Humidity: {1:0.1f}%'.format(
            temperature, humidity))
        # sleep for 0.25 second
        time.sleep(0.25)
    except KeyboardInterrupt:
        sys.exit()
