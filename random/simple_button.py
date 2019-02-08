import RPi.GPIO as IO
import time
import sys

IO.setmode(IO.BOARD)
# pin 40 as input with a pull down resistor --> button
IO.setup(40, IO.IN, pull_up_down=IO.PUD_DOWN)
while True:
    try:
        if (IO.input(40)):
            print("yes")
            time.sleep(0.2)
        else:
            print("no")
            time.sleep(0.2)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
