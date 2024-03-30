import { generateReportForDay } from 'index.js'

export default function handler(req, res) {
    generateReportForDay();
}