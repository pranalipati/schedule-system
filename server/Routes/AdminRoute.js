import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your SMTP server
    host: 'smtp.gmail.com',
    auth: {
        user: 'pranalipatil202121@gmail.com', // Your email address
        pass: 'Pranali@66kp' // Your email password or app password
    }
});

// Admin login route
router.post('/adminlogin', (req, res) => {
    const sql = 'SELECT * FROM admin WHERE username=? AND password=?';
    con.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: 'Query error' });
        
        if (result.length > 0) {
            const admin = result[0]; // Get the first result
            const token = jwt.sign(
                { role: 'admin', username: admin.username }, // Use actual username from result
                'jwt_secret_key',
                { expiresIn: '1d' }
            );
            res.cookie('token', token);
            return res.json({ loginStatus: true, email: admin.email }); // Return email along with login status
        } else {
            return res.json({
                loginStatus: false,
                Error: 'Invalid username or password',
            });
        }
    });
});

// Get all employees
router.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM employees';
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: 'Query error' });
        if (result.length > 0) {
            return res.json({ Status: true, Result: result });
        } else {
            return res.json({ Status: false, Error: 'No employees found' });
        }
    });
});

// Count admins
router.get('/admin_count', (req, res) => {
    const sql = 'SELECT COUNT(id) AS count FROM admin'; // Ensure 'admin' is your actual table name
    con.query(sql, (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query error' });
        }
        if (result.length > 0) {
            return res.json({ Status: true, Result: [{ admin: result[0].count }] }); // Return count
        } else {
            return res.json({ Status: false, Error: 'No admin found' });
        }
    });
});

// Count employees
router.get('/employee_count', (req, res) => {
    const sql = 'SELECT COUNT(id) AS count FROM employees'; // Ensure 'employees' is your actual table name
    con.query(sql, (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query error' });
        }
        if (result.length > 0) {
            return res.json({
                Status: true,
                Result: [{ employee: result[0].count }],
            }); // Return count
        } else {
            return res.json({ Status: false, Error: 'No employees found' });
        }
    });
});

// Schedule route to send emails
router.post('/schedule', async (req, res) => {
    const { employees, date, time, comment, adminEmail } = req.body;

    // Insert schedule into the database
    const scheduleData = { employees: JSON.stringify(employees), date, time, comment };
    
    con.query('INSERT INTO schedules SET ?', scheduleData, async (err) => {
        if (err) {
            return res.status(500).json({ Status: false, Error: err.message });
        }

        const scheduledTime = new Date(`${date}T${time}`);

        // Function to send emails to selected employees and notify admin
        const sendEmails = async () => {
            for (const empId of employees) {
                try {
                    const [results] = await con.query('SELECT email FROM employees WHERE id = ?', [empId]);
                    const employeeEmail = results[0].email;

                    const mailOptions = {
                        from: 'your_email@example.com',
                        to: employeeEmail,
                        subject: 'New Schedule Created',
                        text: `You have been scheduled on ${date} at ${time}. Comment: ${comment}`
                    };

                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.error(`Error sending email to employee ID ${empId}:`, error);
                }
            }

            // Notify admin after sending all emails
            const adminMailOptions = {
                from: 'your_email@example.com',
                to: adminEmail,
                subject: 'All Employee Emails Sent',
                text: `All emails regarding the schedule on ${date} at ${time} have been sent successfully.`
            };

            await transporter.sendMail(adminMailOptions);
        };

        // Schedule reminder emails using cron jobs
        cron.schedule(scheduledTime - 60 * 60 * 1000, sendEmails); // 1 hour before
        cron.schedule(scheduledTime - 30 * 60 * 1000, sendEmails); // 30 minutes before
        cron.schedule(scheduledTime - 15 * 60 * 1000, sendEmails); // 15 minutes before

        res.json({ Status: true, Message: 'Schedule created successfully!' });
    });
});

export { router as adminRouter };
