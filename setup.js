// setup.js
module.exports = {
    design: {
        fontSize: 10,
        yOffset: -20, // Negative moves down, positive moves up
        xOffset: 0,   // Negative moves left, positive moves right
        color: { r: 0.1, g: 0.1, b: 0.1 } 
    },
    message: {
        subject: 'Codefied Daily Challenge Certificate',
        body: (name) => `Hi ${name},\n\nThank you for participating in Codefied 26.1 ! Please find your official certificate attached to this email.\n\nBest regards,\nThe KPH team`
    }
};