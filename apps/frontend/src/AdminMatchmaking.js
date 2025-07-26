// Matchmaking and Analytics Components
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Play, Users, Brain, BarChart3, 
  TrendingUp, Target, Zap, Clock, CheckCircle,
  AlertTriangle, Download, Filter, Calendar
} from 'lucide-react';
import { fetchWithAuth } from './lib/fetchWithAuth';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'https://bichance-production-a30f.up.railway.app');

// Matchmaking Panel Component
export function MatchmakingPanel() {
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [dinnerEvents, setDinnerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchmakingConfigs();
    fetchDinnerEvents();
  }, []);

  const fetchMatchmakingConfigs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/matchmaking/configs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
        setActiveConfig(data.find(c => c.is_active) || data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matchmaking configs:', error);
    }
  };

  const fetchDinnerEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetchWithAuth(`${API_BASE_URL}/api/dinners`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDinnerEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch dinner events:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMatchmaking = async (dinnerEventId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/matchmaking/run`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          dinner_event_id: dinnerEventId,
          algorithm_config_id: activeConfig?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Matchmaking completed! ${result.selected_participants} participants matched with ${(result.average_compatibility * 100).toFixed(1)}% average compatibility.`);
        fetchDinnerEvents();
      }
    } catch (error) {
      console.error('Failed to run matchmaking:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Matchmaking Algorithm</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4" />
            <span>AI-Powered Matching</span>
          </div>
        </div>
      </div>

      {/* Algorithm Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Configuration</h3>
        
        {activeConfig && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personality Weight
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${activeConfig.personality_weight * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{(activeConfig.personality_weight * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Weight
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${activeConfig.location_weight * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{(activeConfig.location_weight * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Preferences Weight
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${activeConfig.cuisine_weight * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{(activeConfig.cuisine_weight * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Preferences Weight
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full"
                      style={{ width: `${activeConfig.time_weight * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{(activeConfig.time_weight * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Min Compatibility Score</div>
            <div className="text-xl font-bold text-gray-900">{((activeConfig?.min_compatibility_score || 0) * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Max Age Difference</div>
            <div className="text-xl font-bold text-gray-900">{activeConfig?.max_age_difference || 0} years</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Diversity Factor</div>
            <div className="text-xl font-bold text-gray-900">{((activeConfig?.diversity_factor || 0) * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Dinner Events for Matching */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Dinner Events</h3>
        
        <div className="space-y-4">
          {dinnerEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.district} • {new Date(event.date).toLocaleDateString()}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.current_participants?.length || 0}/{event.max_participants} participants
                  </span>
                  <span className="flex items-center gap-1">
                    {event.matchmaking_completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Matched
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-500" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {!event.matchmaking_completed && (event.current_participants?.length || 0) >= 5 && (
                  <button
                    onClick={() => runMatchmaking(event.id)}
                    className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Run Matching
                  </button>
                )}
                
                {event.matchmaking_completed && (
                  <button
                    onClick={() => runMatchmaking(event.id)}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Re-match
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Analytics Dashboard Component
export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/dashboard/metrics?days=${dateRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-orange-400 outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="User Growth"
          value={analyticsData?.new_users_this_period || 0}
          subtitle="New users"
          trend={`${analyticsData?.user_retention_rate || 0}% retention`}
          icon={TrendingUp}
          color="green"
        />
        <AnalyticsCard
          title="Booking Rate"
          value={`${analyticsData?.booking_conversion_rate || 0}%`}
          subtitle="Conversion rate"
          trend={`${analyticsData?.bookings_this_period || 0} bookings`}
          icon={Target}
          color="blue"
        />
        <AnalyticsCard
          title="Revenue Growth"
          value={`$${analyticsData?.revenue_this_period?.toLocaleString() || 0}`}
          subtitle="This period"
          trend={`$${analyticsData?.average_booking_value || 0} avg`}
          icon={BarChart3}
          color="orange"
        />
        <AnalyticsCard
          title="Satisfaction"
          value={`${analyticsData?.customer_satisfaction || 0}/5`}
          subtitle="Customer rating"
          trend={`${analyticsData?.repeat_booking_rate || 0}% repeat rate`}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Package */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Package Type</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData?.revenue_by_package || {}).map(([packageType, revenue]) => {
              const total = Object.values(analyticsData?.revenue_by_package || {}).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? ((revenue / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={packageType} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 capitalize">{packageType}</span>
                    <span className="text-sm text-gray-600">${revenue.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        packageType === 'luxury' ? 'bg-purple-400' :
                        packageType === 'premium' ? 'bg-orange-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by City */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by City</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData?.revenue_by_city || {}).map(([city, revenue]) => {
              const total = Object.values(analyticsData?.revenue_by_city || {}).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? ((revenue / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={city} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{city}</span>
                    <span className="text-sm text-gray-600">${revenue.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{analyticsData?.cancellation_rate || 0}%</div>
            <div className="text-sm text-gray-600">Cancellation Rate</div>
            <div className="text-xs text-gray-500 mt-1">Target: <8%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{analyticsData?.no_show_rate || 0}%</div>
            <div className="text-sm text-gray-600">No-Show Rate</div>
            <div className="text-xs text-gray-500 mt-1">Target: <5%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{analyticsData?.repeat_booking_rate || 0}%</div>
            <div className="text-sm text-gray-600">Repeat Booking Rate</div>
            <div className="text-xs text-gray-500 mt-1">Target: >40%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Analytics Card Component
function AnalyticsCard({ title, value, subtitle, trend, icon: Icon, color }) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
        <p className="text-xs text-green-600">{trend}</p>
      </div>
    </div>
  );
}

// Reports Panel Component
export function ReportsPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Quick Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportTemplate
          title="Financial Report"
          description="Revenue, bookings, and payment analytics"
          icon={BarChart3}
          type="financial"
        />
        <ReportTemplate
          title="User Analytics"
          description="User growth, retention, and behavior"
          icon={Users}
          type="user_analytics"
        />
        <ReportTemplate
          title="Restaurant Performance"
          description="Restaurant ratings, bookings, and revenue"
          icon={TrendingUp}
          type="restaurant_performance"
        />
      </div>

      {/* Generated Reports List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{report.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.date_from).toLocaleDateString()} - {new Date(report.date_to).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Generated {new Date(report.generated_at).toLocaleDateString()}
                  </span>
                  <button className="text-orange-400 hover:text-orange-500 text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Report Template Component
function ReportTemplate({ title, description, icon: Icon, type }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}