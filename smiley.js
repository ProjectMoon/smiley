"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
Stay within this 72 character margin, to keep your code easily readable
         1         2         3         4         5         6         7
123456789012345678901234567890123456789012345678901234567890123456789012
*/


// ======================
// IMPORTANT INSTRUCTIONS
// ======================
//
// * As ever, Fork Off this Fiddle BEFORE making any changes.
//
// * Submit your URL with an explicit numerical version suffix
//   (e.g. "jsfiddle.net/qWeRtY/0" denoting version 0)
//   NB: If you do not provide a suffix, the marker is allowed
//   to assume anything. In particular, they may assume 0.
//
// * DON'T CHEAT!


// ================
// FOR ALL STUDENTS
// ================
//
// Draw a "Watchmen" smiley (with blood),
// centred at x=200 y=200 and with a radius of 150 pixels.
//
// You must use standard canvas drawing primitives 
// (excluding "drawImage" and any other use of external files)
//
// The reference images shown below the canvas are provided as 
// a guide to two stylistic variants (the "comic" and "movie" 
// versions respectively).
//
// You do not have to implement the global rotation effect as 
// seen on the movie version (yet!).
//
// `fillEllipse` has been provided for you as a helper function. ;-)
//
// MARKING CRITERIA:
//
// 1 point given for each of the following 25 items:
//
// * Bounding circle has correct position and size
// * Bounding circle is filled with yellow and/or orange hues
// * Bounding circle isn't just a single flat colour
// * Bounding circle has a thin black outline
// * Face has 2 eyes
// * Eyes are in roughly correct place
// * Eyes are symmetrical
// * Eyes are tall ellipses
// * Eyes are filled black
// * Face has a smile
// * Smile is in roughly correct place
// * Smile is symmetrical
// * Smile is between 90 and 180 degrees wide
// * Smile is filled black
// * Smile is of roughly correct thickness
// * Face has 2 "cheeks/dimples" at edges of mouth
// * Cheeks connect with smile
// * Cheeks are symmetrical
// * Cheeks are elliptical
// * Cheeks are tilted inwards
// * Cheeks are of roughly correct thickness
// * Blood exists
// * Blood overlaps with left eye
// * Blood is red
// * Blood has "splat-like" appearance towards top-left edge 
//
// Up to 5 discretionary penalty points may be deducted for:
//
// * poor code-quality e.g. clumsy structure, excessive repetition,
//   poor naming, lack of clarity, lack of appropriate comments, etc
//
// TIPS:
// Consider writing some helper functions to reduce clutter and
// repetition in your code. Large functions are frowned upon.
// Good naming can be very helpful: aim to balance clarity & concision.
//
// EXTRA:
// Well done if you can make the smile slightly thicker at the bottom!
//

function debug(text) {
    document.getElementById('info').innerText = text;
}

function drawBody(ctx, x, y, radius) {
    ctx.save();
    
    ctx.beginPath();
    
    ctx.fillStyle = "yellow";
    ctx.translate(x, y);
    
    ctx.arc(0, 0, radius, 0, Math.PI*2);

    var lightCircleX = x - (radius / 3);
    var lightCircleY = y - (radius / 3);
    var lightCircleRadius = radius / 3;

    var darkCircleX = x + (radius / 3);
    var darkCircleY = y + (radius / 3);
    var darkCircleRadius = radius;

    var rad = ctx.createRadialGradient(lightCircleX, lightCircleY, lightCircleRadius,
				       darkCircleX, darkCircleY, darkCircleRadius);
    rad.addColorStop(0, 'rgb(255,255,0)');
    rad.addColorStop(.9, 'rgb(230,230,0)');
    rad.addColorStop(1, 'rgb(0,0,0)');
    ctx.fillStyle = rad;
    ctx.fill();
    
    ctx.restore();
}

function drawEyes(ctx, smileyX, smileyY, smileyRadius) {
    var leftX = smileyX - (smileyRadius / 3);
    var leftY = smileyY - (smileyRadius / 4);
    var rightX = smileyX + (smileyRadius / 3);
    var rightY = smileyY - (smileyRadius / 4);
    
    var height = smileyRadius * .3;
    var width = height * .35;
	    
    ctx.save();
    ctx.fillStyle = "black";
    fillEllipse(ctx, leftX, leftY, width, height, 0);
    fillEllipse(ctx, rightX, rightY, width, height, 0);
    ctx.restore();
}

function drawSmile(ctx, smileyX, smileyY, smileyRadius) {
    //top smiley portion: bezier curve setup
    var xOffset = smileyRadius * .5;
    var yOffset = smileyRadius * .4;
    var cpOffset = smileyRadius * .35;
    
    var startX = smileyX - xOffset;
    var startY = smileyY + yOffset;

    var endX = smileyX + xOffset;
    var endY = startY;

    //cp = control point
    var cp1X = startX + cpOffset;
    var cp1Y = startY + cpOffset;

    var cp2X = cp1X + (smileyRadius * .3);
    var cp2Y = cp1Y;

    //bottom smiley portion: bezier curve setup
    var bottomCP1Y = cp1Y + (smileyRadius * .05);
    var bottomCP2Y = cp2Y + (smileyRadius * .05);

    //very small lines connecting the two parts of the smiley
    //makes it less pointy at the dimples
    var startBottomY = endY + (smileyRadius * .005);
    var endBottomY = startY + (smileyRadius * .005);

    ctx.save();

    ctx.lineWidth = 2;
    ctx.stroketyle = 'black';
    ctx.fillStyle = 'black';
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    //construction process: top curve, right line, bottom curve, left line.
    //unless radius is too small because the lines don't scale well.
    //then don't use lines.
    if (smileyRadius >= 120) {
	ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
	ctx.lineTo(endX, startBottomY);
	ctx.bezierCurveTo(cp2X, bottomCP2Y, cp1X, bottomCP1Y, startX, endBottomY);
	ctx.lineTo(startX, startY);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
    }
    else {
	ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
	ctx.bezierCurveTo(cp2X, bottomCP2Y, cp1X, bottomCP1Y, startX, startY);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
    }

    ctx.restore();

    //dimples
    var dimpleHeight = smileyRadius * .1;
    var dimpleWidth = dimpleHeight * .15;
    fillEllipse(ctx, startX, startY, dimpleHeight, dimpleWidth, -(Math.PI / 5));
    fillEllipse(ctx, endX, endY, dimpleHeight, dimpleWidth, (Math.PI / 5)); 
}

function drawSmiley(ctx, cx, cy, radius, rotation) {
    var angle = rotation || 0;
    // Here's an example of how to use the fillEllipse helper-function
    //ctx.fillStyle = "green";
    //fillEllipse(ctx, cx, cy, radius, radius, Math.PI/8);
    ctx.save();
    
    if (angle > 0) {
	ctx.translate(cx, cy);
	ctx.rotate(angle);
	ctx.translate(-cx, -cy);
    }
    
    drawBody(ctx, cx, cy, radius);
    drawEyes(ctx, cx, cy, radius);
    drawSmile(ctx, cx, cy, radius);
    ctx.restore();
}


// ================
// HELPER FUNCTIONS
// ================

function fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
    ctx.save(); // save the current ctx state, to restore later
    ctx.beginPath();
    
    // These "matrix ops" are applied in last-to-first order
    // ..which can seem a bit weird, but actually makes sense
    //
    // After modifying the ctx state like this, it's important
    // to restore it
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(halfWidth, halfHeight);
    
    // Just draw a unit circle, and let the matrices do the rest!
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
}

// =============
// TEST "DRIVER"
// =============

var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;

function draw() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    //drawDefaultSmiley(ctx);
    
    // If you are a graduate/masters student, uncomment this
    // line to test your parametric smiley.
    //drawSmiley(ctx,  50,  50,  50);
    drawSmiley(ctx,  g_defaultSmileyX, g_defaultSmileyY, g_defaultSmileyRadius);
}

window.onload = function() {
    draw();
};
