import RPi.GPIO as IO
import time
IO.setwarnings(False)
IO.setmode(IO.BOARD)
IO.setup(40, IO.IN)         #Read output from PIR motion sensor
#IO.setup(3, IO.OUT)         #LED output pin
while True:
	time.sleep(1)
	i=IO.input(40)
	if i==0:                 #When output from motion sensor is LOW
		print "No Intruders",i
	else:
		print "Intruders",i
