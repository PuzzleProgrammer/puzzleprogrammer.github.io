# hydrosurvey
A basic age survey to act as a precursor to the Hydrocolor app.

= = = = = = = = = = = = = = = = = = = = =

Guide to the Hydrocolour Survey Web-app:

= = = = = = = = = = = = = = = = = = = = =

EVERYTHING UP TO LINE ~64 IN index.html (<title> Age range </title>) IS FORMATTING, ACTUAL CONTENT STARTS BELOW THAT
Whenever a change is made, you must update the offline.appcache file with the new files, AND change the version number at the top of the file (this forces an update to the files already on the iPads)

= = = = = = = = = = = = = = = = = = = = =

To change the title:
Change the content between the <title> tags

= = = = = = = = = = = = = = = = = = = = =

To change the icons on the home page:
Find these lines in index.html, and change the "quest#.png" to the name of the new image
<link rel="apple-touch-icon" sizes="76x76" href="quest76.png" />

Make sure the image size (a square with length #) is the same though!

= = = = = = = = = = = = = = = = = = = = =

To change the number of buttons on the page:

Add or remove one line of 
<div class="stretch btn btn-info" id="..." role="button" onclick='...' role="button">...</div>
replacing the ... with the relevant words:

id="..." 		---	replace the ... with anything you want (not used anymore)
onclick='window.open("./thankyou.html#..."+window.location.hash.slice(1));'		---	replace the ... with a unique number
> ... </div>		---	replace the ... with what you want the button to say


Additionally, in the application.js file, in function URLIdea, in the switch/case setup, add (or remove) a new case with the unique number you used for onclick, and make the label something that will tell you what the button was for. This label is what appears on the data.html page.

Finally, in index.html, go to the line that starts with [ <div class = "container button] (without the square brackets), and replace the number in button# with the number of buttons on the page (currently there is a pre-set sizing for 5 and 6 buttons)

If you need something other than 5 or 6 buttons, you need to go into the custom.css file and create some new stuff for a new button amount, copying the format at the bottom of the file.

= = = = = = = = = = = = = = = = = = = = =

To save the web-app to the iPad:

Go to "http://puzzleprogrammer.github.io/Meopar/index.html#NUM", where NUM is a unique 1-digit number for the iPad (for the current iPads, this is their FOCOS number, make sure the numbers go in incremental order starting at 1 - no skipping a number!).

On that page, tap the icon that looks like a square with an arrow pointing up on safari, and choose the "Add to Home Screen" option.
You get the option to rename the app, then it is saved to the home screen as an app.

Finally, open it up and tap any button to finish saving the app to the iPad (after this satage it will work without an internet connection).

= = = = = = = = = = = = = = = = = = = = =

To add a new iPad:

Save the web app to the iPad as above, with a unique number specific to the iPad. Next, in application.js, simply change the number_of_iPads variable at the top of the file so it is accurate. - You do need to be sure that the unique numbers are from 1 to number_of_iPads, without any missing numbers inbetween though.