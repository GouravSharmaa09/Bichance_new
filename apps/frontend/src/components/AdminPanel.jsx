import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Settings, 
  BarChart3, 
  Plus, 
  LogOut, 
  Home,
  Utensils,
  Building2,
  TrendingUp,
  DollarSign,
  UserCheck,
  Clock,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDinner, setShowCreateDinner] = useState(false);
  const [dinners, setDinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dinnerForm, setDinnerForm] = useState({
    date: '',
    time: '',
    city: '',
    country: 'India'
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Fetch all dinners
  const fetchDinners = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch('https://bichance-production-a30f.up.railway.app/api/v1/admin/dinner/all', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDinners(data.data || []);
      } else {
        console.log('Failed to fetch dinners:', response.status);
      }
    } catch (error) {
      console.error('Error fetching dinners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load dinners when component mounts or when dinners tab is active
  React.useEffect(() => {
    if (activeTab === 'dinners') {
      fetchDinners();
    }
  }, [activeTab]);

  const handleCreateDinner = async (e) => {
    e.preventDefault();
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Format the date and time for the API
      const dateTime = new Date(`${dinnerForm.date}T${dinnerForm.time}:00.000Z`);
      
      const requestBody = {
        date: dateTime.toISOString(),
        city: dinnerForm.city,
        country: dinnerForm.country
      };

      console.log('Creating dinner with:', requestBody);
      
      const response = await fetch('https://bichance-production-a30f.up.railway.app/api/v1/admin/dinner/create', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

             if (response.ok) {
         toast.success('Dinner created successfully!');
         setShowCreateDinner(false);
         setDinnerForm({
           date: '',
           time: '',
           city: '',
           country: 'India'
         });
         // Refresh dinners list after creating new dinner
         if (activeTab === 'dinners') {
           fetchDinners();
         }
       } else {
        const errorMessage = data.detail || data.message || 'Failed to create dinner';
        console.log('Dinner creation failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating dinner:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'blue', change: '+12%' },
    { title: 'Active Dinners', value: '45', icon: Utensils, color: 'green', change: '+8%' },
    { title: 'Revenue', value: '$12,345', icon: DollarSign, color: 'purple', change: '+15%' },
    { title: 'Restaurants', value: '23', icon: Building2, color: 'orange', change: '+5%' }
  ];

  const recentActivities = [
    { type: 'user', message: 'New user registered', time: '2 minutes ago', icon: UserCheck },
    { type: 'dinner', message: 'Dinner created: Italian Night', time: '15 minutes ago', icon: Utensils },
    { type: 'booking', message: 'New booking confirmed', time: '1 hour ago', icon: Calendar },
    { type: 'review', message: '5-star review received', time: '2 hours ago', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.h1 
                className="text-2xl font-bold text-purple-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Bichance Admin
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'dinners', label: 'Dinners', icon: Utensils },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'restaurants', label: 'Restaurants', icon: Building2 },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'overview' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                    <motion.button
                      onClick={() => setShowCreateDinner(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Dinner</span>
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                          <div className="flex items-center space-x-3">
                            <Plus className="w-5 h-5" />
                            <span>Create New Dinner</span>
                          </div>
                        </button>
                        <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                          <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5" />
                            <span>Manage Users</span>
                          </div>
                        </button>
                        <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                          <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5" />
                            <span>Add Restaurant</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <activity.icon className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === 'dinners' && (
                 <div>
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-semibold text-gray-800">Dinner Management</h2>
                     <motion.button
                       onClick={() => setShowCreateDinner(true)}
                       className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <Plus className="w-4 h-4" />
                       <span>Create Dinner</span>
                     </motion.button>
                   </div>
                   
                   {loading ? (
                     <div className="flex justify-center items-center py-12">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                       <span className="ml-3 text-gray-600">Loading dinners...</span>
                     </div>
                   ) : dinners.length === 0 ? (
                     <div className="text-center py-12">
                       <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                       <h3 className="text-lg font-medium text-gray-900 mb-2">No dinners found</h3>
                       <p className="text-gray-600 mb-4">Create your first dinner to get started!</p>
                       <motion.button
                         onClick={() => setShowCreateDinner(true)}
                         className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                       >
                         <Plus className="w-4 h-4 inline mr-2" />
                         Create First Dinner
                       </motion.button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="flex justify-between items-center">
                         <h3 className="text-lg font-medium text-gray-900">All Dinners ({dinners.length})</h3>
                         <motion.button
                           onClick={fetchDinners}
                           className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                           whileHover={{ scale: 1.05 }}
                         >
                           <Clock className="w-4 h-4 mr-1" />
                           Refresh
                         </motion.button>
                       </div>
                       
                       <div className="grid gap-4">
                         {dinners.map((dinner, index) => (
                           <motion.div
                             key={dinner.id || index}
                             className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: index * 0.1 }}
                           >
                             <div className="flex justify-between items-start">
                               <div className="flex-1">
                                 <div className="flex items-center space-x-3 mb-3">
                                   <div className="p-2 bg-purple-100 rounded-lg">
                                     <Utensils className="w-5 h-5 text-purple-600" />
                                   </div>
                                   <div>
                                     <h4 className="text-lg font-semibold text-gray-900">
                                       Dinner #{dinner.id || index + 1}
                                     </h4>
                                     <p className="text-sm text-gray-500">
                                       Created on {new Date(dinner.created_at || Date.now()).toLocaleDateString()}
                                     </p>
                                   </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                   <div className="flex items-center space-x-2">
                                     <Calendar className="w-4 h-4 text-gray-400" />
                                     <span className="text-gray-600">
                                       {new Date(dinner.date).toLocaleDateString()}
                                     </span>
                                   </div>
                                   <div className="flex items-center space-x-2">
                                     <Clock className="w-4 h-4 text-gray-400" />
                                     <span className="text-gray-600">
                                       {new Date(dinner.date).toLocaleTimeString()}
                                     </span>
                                   </div>
                                   <div className="flex items-center space-x-2">
                                     <MapPin className="w-4 h-4 text-gray-400" />
                                     <span className="text-gray-600">
                                       {dinner.city}, {dinner.country}
                                     </span>
                                   </div>
                                 </div>
                               </div>
                               
                               <div className="flex space-x-2">
                                 <motion.button
                                   className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                   whileHover={{ scale: 1.05 }}
                                   whileTap={{ scale: 0.95 }}
                                   title="Edit Dinner"
                                 >
                                   <Settings className="w-4 h-4" />
                                 </motion.button>
                                 <motion.button
                                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                   whileHover={{ scale: 1.05 }}
                                   whileTap={{ scale: 0.95 }}
                                   title="Delete Dinner"
                                 >
                                   <LogOut className="w-4 h-4" />
                                 </motion.button>
                               </div>
                             </div>
                           </motion.div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
                  <p className="text-gray-600">User management functionality will be implemented here.</p>
                </div>
              )}

              {activeTab === 'restaurants' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Management</h2>
                  <p className="text-gray-600">Restaurant management functionality will be implemented here.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">System Settings</h2>
                  <p className="text-gray-600">System settings and configuration options will be available here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Today's Bookings</span>
                  <span className="font-semibold text-purple-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Reviews</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold text-green-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue Today</span>
                  <span className="font-semibold text-purple-600">$2,340</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Service</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Dinner Modal */}
      {showCreateDinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Dinner</h2>
                <button
                  onClick={() => setShowCreateDinner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
                         <form onSubmit={handleCreateDinner} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Date
                   </label>
                   <input
                     type="date"
                     value={dinnerForm.date}
                     onChange={(e) => setDinnerForm({...dinnerForm, date: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Time
                   </label>
                   <input
                     type="time"
                     value={dinnerForm.time}
                     onChange={(e) => setDinnerForm({...dinnerForm, time: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     City
                   </label>
                   <input
                     type="text"
                     value={dinnerForm.city}
                     onChange={(e) => setDinnerForm({...dinnerForm, city: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                     placeholder="Enter city"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Country
                   </label>
                   <select
                     value={dinnerForm.country}
                     onChange={(e) => setDinnerForm({...dinnerForm, country: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                     required
                   >
                     <option value="India">India</option>
                     <option value="USA">USA</option>
                     <option value="UK">UK</option>
                     <option value="Canada">Canada</option>
                     <option value="Australia">Australia</option>
                     <option value="Germany">Germany</option>
                     <option value="France">France</option>
                     <option value="Japan">Japan</option>
                   </select>
                 </div>
               </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateDinner(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Create Dinner
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 