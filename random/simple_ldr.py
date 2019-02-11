import RPi.GPIO as IO
import time
import sys

IO.setmode(IO.BOARD)
IO.setup(40, IO.IN)
while True:
    try:
        print(IO.input(40))
        time.sleep(1)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
