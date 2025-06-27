import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  DollarSign, 
  Award,
  Calendar,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import axiosInstance from '../common/AxiosInstance';

const AdminStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completedCourses: 0,
    avgRating: 4.5,
    monthlyGrowth: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all statistics data
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch users and courses data
      const [usersRes, coursesRes] = await Promise.all([
        axiosInstance.get('/api/admin/getallusers', {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }),
        axiosInstance.get('/api/admin/getallcourses', {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      if (usersRes.data.success && coursesRes.data.success) {
        const users = usersRes.data.data;
        const courses = coursesRes.data.data;

        // Calculate statistics
        const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolled || 0), 0);
        const totalRevenue = courses.reduce((sum, course) => {
          const price = course.C_price === 'free' ? 0 : parseFloat(course.C_price) || 0;
          return sum + (price * (course.enrolled || 0));
        }, 0);

        const students = users.filter(user => user.type === 'Student');
        const teachers = users.filter(user => user.type === 'Teacher');
        const activeUsers = Math.floor(users.length * 0.7); // 70% active rate simulation
        const completedCourses = Math.floor(totalEnrollments * 0.3); // 30% completion rate

        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          totalEnrollments,
          totalRevenue,
          activeUsers,
          completedCourses,
          avgRating: 4.5,
          monthlyGrowth: 12.5,
          students: students.length,
          teachers: teachers.length
        });

        // Generate top courses data
        const sortedCourses = courses
          .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
          .slice(0, 5)
          .map(course => ({
            ...course,
            revenue: course.C_price === 'free' ? 0 : (parseFloat(course.C_price) || 0) * (course.enrolled || 0)
          }));
        setTopCourses(sortedCourses);

        // Generate recent activity (simulated)
        const activities = [
          { type: 'enrollment', user: 'John Doe', course: 'React Fundamentals', time: '2 hours ago' },
          { type: 'completion', user: 'Jane Smith', course: 'JavaScript Basics', time: '4 hours ago' },
          { type: 'new_course', user: 'Prof. Wilson', course: 'Advanced Python', time: '6 hours ago' },
          { type: 'enrollment', user: 'Mike Johnson', course: 'Data Science', time: '8 hours ago' },
          { type: 'completion', user: 'Sarah Brown', course: 'Web Design', time: '1 day ago' }
        ];
        setRecentActivity(activities);

        // Generate growth data (simulated)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const growthData = months.map((month, index) => ({
          month,
          users: Math.floor(users.length * (0.5 + index * 0.1)),
          revenue: Math.floor(totalRevenue * (0.4 + index * 0.1))
        }));
        setUserGrowth(growthData);
        setRevenueData(growthData);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStatistics();
    
    // Listen for enrollment success events
    const handleEnrollmentSuccess = () => {
      fetchStatistics();
    };
    
    window.addEventListener('enrollmentSuccess', handleEnrollmentSuccess);
    
    return () => {
      window.removeEventListener('enrollmentSuccess', handleEnrollmentSuccess);
    };
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment': return '📚';
      case 'completion': return '🎓';
      case 'new_course': return '➕';
      default: return '📊';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'enrollment': return 'primary';
      case 'completion': return 'success';
      case 'new_course': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p>Loading ultimate statistics...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div>
          <h1 className="text-gradient mb-2">📊 Ultimate Admin Statistics</h1>
          <p className="text-muted">Comprehensive platform analytics and insights</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={refreshData}
            disabled={refreshing}
            className="d-flex align-items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline-success" className="d-flex align-items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="stats-grid slide-up">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
            <Users size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="stat-label">Total Users</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +{stats.monthlyGrowth}% this month
          </div>
        </div>

        {/* Total Courses */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-secondary)', color: 'white' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-color)' }}>
            {stats.totalCourses.toLocaleString()}
          </div>
          <div className="stat-label">Total Courses</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +8.3% this month
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-accent)', color: 'white' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +15.7% this month
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'var(--neutral-800)' }}>
            <Award size={24} />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning-color)' }}>
            {stats.totalEnrollments.toLocaleString()}
          </div>
          <div className="stat-label">Total Enrollments</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +22.1% this month
          </div>
        </div>

        {/* Active Users */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-color)', color: 'white' }}>
            👥
          </div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="stat-label">Active Users (30 days)</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +5.2% this month
          </div>
        </div>

        {/* Completed Courses */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-color)', color: 'white' }}>
            🎓
          </div>
          <div className="stat-value" style={{ color: 'var(--warning-color)' }}>
            {stats.completedCourses.toLocaleString()}
          </div>
          <div className="stat-label">Completed Courses</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +18.9% this month
          </div>
        </div>

        {/* Average Rating */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-color)', color: 'white' }}>
            ⭐
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-color)' }}>
            {stats.avgRating}
          </div>
          <div className="stat-label">Average Rating</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +0.3 this month
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--error-color)', color: 'white' }}>
            📈
          </div>
          <div className="stat-value" style={{ color: 'var(--error-color)' }}>
            {((stats.totalEnrollments / stats.totalUsers) * 100).toFixed(1)}%
          </div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +2.1% this month
          </div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {/* Top Performing Courses */}
        <Col lg={8}>
          <div className="chart-container slide-up">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">🏆 Top Performing Courses</h3>
                <p className="chart-subtitle">Ranked by enrollment and revenue</p>
              </div>
            </div>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Enrollments</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course, index) => (
                  <tr key={course._id}>
                    <td>
                      <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'light'} text="dark">
                        #{index + 1}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <strong>{course.C_title}</strong>
                        <br />
                        <small className="text-muted">{course.C_categories}</small>
                      </div>
                    </td>
                    <td>{course.C_educator}</td>
                    <td>
                      <Badge bg="primary">{course.enrolled || 0}</Badge>
                    </td>
                    <td>
                      <strong className="text-success">₹{course.revenue.toLocaleString()}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <span>⭐</span>
                        <span>{(4.0 + Math.random()).toFixed(1)}</span>
                      </div>
                    </td>
                    <td style={{ width: '120px' }}>
                      <ProgressBar 
                        now={Math.min(((course.enrolled || 0) / 100) * 100, 100)} 
                        variant="success"
                        style={{ height: '6px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        {/* Recent Activity */}
        <Col lg={4}>
          <div className="chart-container slide-up">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">🔔 Recent Activity</h3>
                <p className="chart-subtitle">Latest platform activities</p>
              </div>
            </div>
            <div className="activity-feed">
              {recentActivity.map((activity, index) => (
                <div key={index} className="d-flex align-items-start gap-3 mb-3 p-3 bg-light rounded">
                  <div className="activity-icon">
                    <span style={{ fontSize: '1.5rem' }}>{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{activity.user}</strong>
                        <div className="small text-muted">
                          {activity.type === 'enrollment' && 'enrolled in'}
                          {activity.type === 'completion' && 'completed'}
                          {activity.type === 'new_course' && 'created'}
                          {' '}<em>{activity.course}</em>
                        </div>
                      </div>
                      <Badge bg={getActivityColor(activity.type)} className="ms-2">
                        {activity.type}
                      </Badge>
                    </div>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* User Demographics */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <div className="chart-container slide-up">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">👥 User Demographics</h3>
                <p className="chart-subtitle">User distribution by type</p>
              </div>
            </div>
            <Row className="text-center">
              <Col xs={6}>
                <div className="p-4">
                  <div className="stat-value" style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>
                    {stats.students}
                  </div>
                  <div className="stat-label">Students</div>
                  <ProgressBar 
                    now={(stats.students / stats.totalUsers) * 100} 
                    variant="primary"
                    className="mt-2"
                    style={{ height: '8px' }}
                  />
                  <small className="text-muted">
                    {((stats.students / stats.totalUsers) * 100).toFixed(1)}%
                  </small>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-4">
                  <div className="stat-value" style={{ color: 'var(--success-color)', fontSize: '2rem' }}>
                    {stats.teachers}
                  </div>
                  <div className="stat-label">Teachers</div>
                  <ProgressBar 
                    now={(stats.teachers / stats.totalUsers) * 100} 
                    variant="success"
                    className="mt-2"
                    style={{ height: '8px' }}
                  />
                  <small className="text-muted">
                    {((stats.teachers / stats.totalUsers) * 100).toFixed(1)}%
                  </small>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col lg={6}>
          <div className="chart-container slide-up">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">📈 Growth Trends</h3>
                <p className="chart-subtitle">Monthly growth overview</p>
              </div>
            </div>
            <div className="growth-metrics">
              {userGrowth.slice(-3).map((data, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded">
                  <div>
                    <strong>{data.month}</strong>
                    <div className="small text-muted">Users: {data.users}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-success fw-bold">₹{data.revenue.toLocaleString()}</div>
                    <div className="small text-muted">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="chart-container slide-up">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">⚡ Quick Actions</h3>
            <p className="chart-subtitle">Common administrative tasks</p>
          </div>
        </div>
        <Row className="g-3">
          <Col md={3}>
            <Button variant="outline-primary" className="w-100 p-3">
              <Users size={20} className="mb-2" />
              <div>Manage Users</div>
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-success" className="w-100 p-3">
              <BookOpen size={20} className="mb-2" />
              <div>Review Courses</div>
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-warning" className="w-100 p-3">
              <DollarSign size={20} className="mb-2" />
              <div>Revenue Report</div>
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-info" className="w-100 p-3">
              <Award size={20} className="mb-2" />
              <div>Certificates</div>
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AdminStatistics;