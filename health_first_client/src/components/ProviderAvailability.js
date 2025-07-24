import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Plus, Edit, Trash2, Settings, ChevronLeft, ChevronRight, 
  CheckCircle, AlertCircle, Info, Copy, Save, RotateCcw, Download, Upload,
  Stethoscope, User, MapPin, Phone, Mail, Star, Filter, Search, MoreVertical, X
} from 'lucide-react';
import clsx from 'clsx';
import apiService from '../services/api';
import config from '../utils/config';

const ProviderAvailability = () => {
  const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    appointmentType: 'all',
    status: 'all',
    duration: 'all'
  });

  // Mock data for demonstration
  const mockAvailability = [
    {
      id: 1,
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      type: 'consultation',
      status: 'available',
      duration: 60,
      notes: 'General consultation'
    },
    {
      id: 2,
      date: '2024-01-15',
      startTime: '10:30',
      endTime: '11:00',
      type: 'follow-up',
      status: 'booked',
      duration: 30,
      notes: 'Follow-up appointment'
    },
    {
      id: 3,
      date: '2024-01-16',
      startTime: '14:00',
      endTime: '15:00',
      type: 'consultation',
      status: 'available',
      duration: 60,
      notes: 'New patient consultation'
    }
  ];

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      // In real implementation, this would call the API
      // const response = await apiService.getProviderAvailability();
      // setAvailabilityData(response.data);
      
      // For now, use mock data
      setAvailabilityData(mockAvailability);
      
      if (config.isDebugMode) {
        console.log('Availability data loaded:', mockAvailability);
      }
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'booked':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      case 'tentative':
        return 'bg-yellow-500';
      case 'break':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'blocked':
        return 'Blocked';
      case 'tentative':
        return 'Tentative';
      case 'break':
        return 'Break';
      default:
        return 'Unknown';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4" />;
      case 'follow-up':
        return <User className="w-4 h-4" />;
      case 'emergency':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
    } else {
      if (currentView === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (currentView === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSlotClick = (slot) => {
    setEditingSlot(slot);
    setShowEditForm(true);
  };

  const handleAddAvailability = () => {
    setShowAddForm(true);
  };

  const handleBulkAction = (action) => {
    if (selectedSlots.length === 0) {
      alert('Please select slots first');
      return;
    }
    
    // Handle bulk actions
    console.log(`Performing ${action} on ${selectedSlots.length} slots`);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const daySlots = availabilityData.filter(slot => slot.date === dateStr);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={clsx(
                "min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50",
                !isCurrentMonth && "bg-gray-100 text-gray-400",
                isToday && "bg-blue-50 border-blue-300"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-sm font-medium mb-1">
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {daySlots.slice(0, 3).map(slot => (
                  <div
                    key={slot.id}
                    className={clsx(
                      "text-xs p-1 rounded truncate cursor-pointer",
                      getStatusColor(slot.status),
                      "text-white"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlotClick(slot);
                    }}
                  >
                    {slot.startTime} - {slot.type}
                  </div>
                ))}
                {daySlots.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{daySlots.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }

    const timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1">
            <div className="p-2 text-sm font-medium text-gray-500 bg-gray-50">
              Time
            </div>
            {days.map(day => (
              <div key={day.toDateString()} className="p-2 text-sm font-medium text-gray-500 bg-gray-50 text-center">
                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            ))}
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="p-2 text-xs text-gray-500 border-r border-gray-200">
                  {time}
                </div>
                {days.map(day => {
                  const dateStr = day.toISOString().split('T')[0];
                  const slot = availabilityData.find(s => 
                    s.date === dateStr && s.startTime === time
                  );
                  
                  return (
                    <div
                      key={`${day.toDateString()}-${time}`}
                      className={clsx(
                        "p-1 border-b border-gray-100 min-h-[40px] cursor-pointer hover:bg-gray-50",
                        slot && getStatusColor(slot.status)
                      )}
                      onClick={() => slot ? handleSlotClick(slot) : handleAddSlot(day, time)}
                    >
                      {slot && (
                        <div className="text-xs text-white truncate">
                          {slot.type}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const daySlots = availabilityData.filter(slot => slot.date === dateStr);
    
    const timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }

    return (
      <div className="space-y-2">
        <div className="text-lg font-semibold text-center mb-4">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div className="space-y-1">
          {timeSlots.map(time => {
            const slot = daySlots.find(s => s.startTime === time);
            
            return (
              <div
                key={time}
                className={clsx(
                  "p-3 border rounded-lg cursor-pointer hover:bg-gray-50",
                  slot && getStatusColor(slot.status),
                  slot && "text-white"
                )}
                onClick={() => slot ? handleSlotClick(slot) : handleAddSlot(currentDate, time)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{time}</span>
                  {slot ? (
                    <div className="flex items-center space-x-2">
                      <span>{slot.type}</span>
                      <span className="text-xs">{slot.duration}min</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Click to add availability</span>
                  )}
                </div>
                {slot && slot.notes && (
                  <div className="text-xs mt-1 opacity-75">
                    {slot.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setCurrentView('day');
  };

  const handleAddSlot = (date, time) => {
    setEditingSlot({
      date: date.toISOString().split('T')[0],
      startTime: time,
      endTime: '',
      type: 'consultation',
      status: 'available',
      duration: 30,
      notes: ''
    });
    setShowAddForm(true);
  };

  const renderAddEditForm = () => {
    const isEditing = editingSlot?.id;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Availability' : 'Add Availability'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingSlot(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editingSlot?.date || ''}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editingSlot?.startTime || ''}
                    onChange={(e) => setEditingSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editingSlot?.endTime || ''}
                    onChange={(e) => setEditingSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={editingSlot?.type || 'consultation'}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="break">Break</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={editingSlot?.duration || 30}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editingSlot?.notes || ''}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingSlot(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isEditing ? 'Update' : 'Add'} Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Availability Management
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                Dr. Sarah Johnson • Cardiology
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddAvailability}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Availability</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* View Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Calendar View</h3>
                <div className="space-y-2">
                  {[
                    { key: 'month', label: 'Month' },
                    { key: 'week', label: 'Week' },
                    { key: 'day', label: 'Day' }
                  ].map(view => (
                    <button
                      key={view.key}
                      onClick={() => setCurrentView(view.key)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        currentView === view.key
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                    <Copy className="w-4 h-4 inline mr-2" />
                    Copy Week
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Template
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                    <Download className="w-4 h-4 inline mr-2" />
                    Export Schedule
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">This Week</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-green-600">12 slots</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booked</span>
                    <span className="font-medium text-blue-600">8 appointments</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Blocked</span>
                    <span className="font-medium text-red-600">3 slots</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
                <div className="space-y-2">
                  {[
                    { status: 'available', label: 'Available' },
                    { status: 'booked', label: 'Booked' },
                    { status: 'blocked', label: 'Blocked' },
                    { status: 'tentative', label: 'Tentative' },
                    { status: 'break', label: 'Break' }
                  ].map(item => (
                    <div key={item.status} className="flex items-center space-x-2">
                      <div className={clsx("w-3 h-3 rounded-full", getStatusColor(item.status))} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDateChange('prev')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDateChange('next')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {currentView === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    {currentView === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <button
                    onClick={handleToday}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Today
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={selectedSlots.length === 0}
                    className={clsx(
                      "px-3 py-1 text-sm rounded-md",
                      selectedSlots.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                    )}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('copy')}
                    disabled={selectedSlots.length === 0}
                    className={clsx(
                      "px-3 py-1 text-sm rounded-md",
                      selectedSlots.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    <Copy className="w-4 h-4 inline mr-1" />
                    Copy Selected
                  </button>
                </div>
              </div>

              {/* Calendar Content */}
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div>
                    {currentView === 'month' && renderMonthView()}
                    {currentView === 'week' && renderWeekView()}
                    {currentView === 'day' && renderDayView()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || showEditForm) && renderAddEditForm()}
    </div>
  );
};

export default ProviderAvailability; 