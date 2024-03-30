import { generateReportForDay } from 'get-posts.js'

export default function handler(req, res) {
    console.log("CRON")
    generateReportForDay();
}