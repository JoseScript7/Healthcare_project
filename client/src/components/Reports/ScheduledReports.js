import React, { useState, useEffect } from 'react';
import { scheduledReportService } from '../../services/scheduled-report.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ScheduleForm from './ScheduleForm';

function ScheduledReports() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduledReportService.getSchedules();
      setSchedules(data);
    } catch (error) {
      setError('Failed to load schedules');
      console.error('Load Schedules Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (data) => {
    try {
      setError(null);
      const newSchedule = await scheduledReportService.createSchedule(data);
      setSchedules([newSchedule, ...schedules]);
      setIsFormOpen(false);
    } catch (error) {
      setError('Failed to create schedule');
      console.error('Create Schedule Error:', error);
    }
  };

  const handleUpdateSchedule = async (scheduleId, data) => {
    try {
      setError(null);
      const updatedSchedule = await scheduledReportService.updateSchedule(scheduleId, data);
      setSchedules(schedules.map(s => 
        s.schedule_id === scheduleId ? updatedSchedule : s
      ));
      setEditingSchedule(null);
    } catch (error) {
      setError('Failed to update schedule');
      console.error('Update Schedule Error:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      setError(null);
      await scheduledReportService.deleteSchedule(scheduleId);
      setSchedules(schedules.filter(s => s.schedule_id !== scheduleId));
    } catch (error) {
      setError('Failed to delete schedule');
      console.error('Delete Schedule Error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="scheduled-reports">
      <div className="scheduled-reports-header">
        <h3>Scheduled Reports</h3>
        <button 
          className="create-schedule-btn"
          onClick={() => setIsFormOpen(true)}
        >
          Create New Schedule
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {isFormOpen && (
        <ScheduleForm
          onSubmit={handleCreateSchedule}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <div className="schedules-list">
        {schedules.map(schedule => (
          <div key={schedule.schedule_id} className="schedule-item">
            {editingSchedule === schedule.schedule_id ? (
              <ScheduleForm
                schedule={schedule}
                onSubmit={(data) => handleUpdateSchedule(schedule.schedule_id, data)}
                onCancel={() => setEditingSchedule(null)}
              />
            ) : (
              <div className="schedule-details">
                <div className="schedule-info">
                  <h4>{schedule.report_type} Report</h4>
                  <p>Frequency: {schedule.frequency}</p>
                  <p>Format: {schedule.format}</p>
                  <p>Next Run: {new Date(schedule.next_run).toLocaleString()}</p>
                </div>
                <div className="schedule-actions">
                  <button
                    onClick={() => setEditingSchedule(schedule.schedule_id)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduledReports; 