import { scheduledReportService } from '../services/scheduled-report.service.js';

export const createSchedule = async (req, res) => {
  try {
    const schedule = await scheduledReportService.createSchedule({
      ...req.body,
      user_id: req.user.user_id,
      facility_id: req.user.facility_id
    });
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Create Schedule Error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await scheduledReportService.updateSchedule(
      req.params.id,
      req.body
    );
    res.json(schedule);
  } catch (error) {
    console.error('Update Schedule Error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await scheduledReportService.deleteSchedule(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Delete Schedule Error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = await scheduledReportService.getSchedulesByUser(req.user.user_id);
    res.json(schedules);
  } catch (error) {
    console.error('Get Schedules Error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}; 