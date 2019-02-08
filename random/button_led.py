import RPi.GPIO as IO
import time
import sys

IO.setmode(IO.BOARD)
IO.setup(40, IO.IN, pull_up_down=IO.PUD_DOWN)
IO.setup(35, IO.OUT)
# setting default led status
led = False
while True:
    try:
        if not IO.input(40):
            # set the led status to false if true and viceversa
            led = not led
            # sleeping so it does not take multiple inputs
            time.sleep(0.5)
        # output the led status
        IO.output(35, 1 if led else 0)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
