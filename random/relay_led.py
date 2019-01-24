import RPi.GPIO as IO
import time
import sys

# programming t04:07 PMhe GPIO by BOARD pin numbers, GPIO21$
IO.setmode(IO.BOARD)
# initialize digital pin40 as an output.
IO.setup(37, IO.OUT)
while True:
    try:
        # turn the LED on
        IO.output(37, 1)
        # sleep for a second
        time.sleep(1)
        # turn the LED on
        IO.output(37, 0)
        # sleep for a second
        time.sleep(1)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
