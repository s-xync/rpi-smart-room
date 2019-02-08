import RPi.GPIO as IO
import time
import sys

IO.setmode(IO.BOARD)
# initialize digital pin38 as an input.
IO.setup(38, IO.IN)
while True:
    try:
        # prints input of metal touch sensor (0 or 1)
        print IO.input(38)
        # sleep for a second
        time.sleep(1)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
