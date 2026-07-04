// setup.js
module.exports = {
    design: {
        fontSize: 60,
        yOffset: -20, // Negative moves down, positive moves up
        xOffset: 0,   // Negative moves left, positive moves right
        color: { r: 0.1, g: 0.1, b: 0.1 } 
    },
    message: {
        subject: 'Test kr rha hoon',
        body: (name) => `Hi ${name},\n\nThank you for participating! Please find your official certificate attached to this email.\n\nBest regards,\nThe KPH team`
    }
};