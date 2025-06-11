## Background
For funsese. I have a lot of cool neighbors. One is an insurance underwriter for the private aerospace industry. She helps calculate the cost and risk for her companies book of business.

One day we were talking and she mentioned that what she wishes she had is more data on the actual flights being made by individual pilost on individual aircraft.

## Archtect
I asked my neighbor a series of questions about what data was relevant and how it might be collected. 

The answer seemed to be clear, if pilots filled out some information in a frictionless manor, she would get accurate data for each flight.

The UI would be simple.
1. Pilot logs in
2. Pilot selects the aircraft that they are flying, (these are generally charter flgihts where a pilot may flay any number of aircraft)
3. push a button before starting flight - record time and GPS daat
4. Push a button when ending the flight - record time and GPS daat

## Result this POC
This is the backend to a front end that does just that. It takes into consideration spotty wireless signals. 
