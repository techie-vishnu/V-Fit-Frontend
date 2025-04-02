import React, { useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Dropdown, ProgressBar } from 'react-bootstrap';
import {
  FiHome, FiActivity, FiSettings, FiPieChart, FiCalendar,
  FiUser, FiAward, FiHeart, FiTrendingUp, FiMoon, FiSun, FiBell, FiMail
} from 'react-icons/fi';

function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // Sample fitness data
  const fitnessStats = [
    { title: 'Workouts', value: '12', change: '+3', trend: 'up', icon: <FiActivity className="tw:text-blue-500" /> },
    { title: 'Active Calories', value: '1,245', change: '+12%', trend: 'up', icon: <FiTrendingUp className="tw:text-red-500" /> },
    { title: 'Avg Heart Rate', value: '72 bpm', change: '-2%', trend: 'down', icon: <FiHeart className="tw:text-green-500" /> },
    { title: 'Current Streak', value: '7 days', change: '+2', trend: 'up', icon: <FiAward className="tw:text-yellow-500" /> },
  ];

  const recentWorkouts = [
    { id: '#W001', type: 'Strength Training', date: '2023-05-15', duration: '45 min', calories: '320' },
    { id: '#W002', type: 'Running', date: '2023-05-14', duration: '30 min', calories: '280' },
    { id: '#W003', type: 'Yoga', date: '2023-05-14', duration: '60 min', calories: '180' },
    { id: '#W004', type: 'Cycling', date: '2023-05-13', duration: '45 min', calories: '350' },
  ];

  const fitnessGoals = [
    { name: 'Weekly Workouts', progress: 75, target: '5/7 days' },
    { name: 'Weight Loss', progress: 40, target: '4/10 lbs' },
    { name: 'Water Intake', progress: 85, target: '2.5/3 L' },
  ];

  return (
    <Container fluid className="tw:py-6 tw:px-4">
      {/* Page Header */}
      <div className="tw:mb-6">
        <h1 className={`tw:text-2xl tw:font-bold tw:dark:text-white tw:text-gray-800`}>Fitness Dashboard</h1>
        <p className="tw:text-gray-400 tw:text-gray-600">
          Welcome back! Here's your fitness progress overview.
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="tw:mb-6">
        {fitnessStats.map((stat, index) => (
          <Col key={index} xs={12} md={6} lg={3} className="tw:mb-4 lg:tw:mb-0">
            <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:dark:bg-gray-800 tw:bg-white`}>
              <Card.Body>
                <div className="tw:flex tw:justify-between tw:items-start">
                  <div>
                    <div className="tw:flex tw:items-center">
                      <div className="tw:mr-3">
                        {stat.icon}
                      </div>
                      <h5 className={`tw:text-sm tw:font-medium tw:dark:text-gray-400 tw:text-gray-500`}>{stat.title}</h5>
                    </div>
                    <h3 className={`tw:mt-1 tw:text-2xl tw:font-semibold tw:dark:text-white tw:text-gray-800`}>{stat.value}</h3>
                  </div>
                  <span className={`tw:px-2 tw:py-1 tw:text-xs tw:rounded-full ${stat.trend === 'up' ? 'tw:bg-green-100 tw:text-green-800' : 'tw:bg-red-100 tw:text-red-800'}`}>
                    {stat.change}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Row */}
      <Row>
        {/* Left Column */}
        <Col lg={8} className="tw:mb-4 lg:tw:mb-0">
          {/* Workout Chart */}
          <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:mb-4 tw:dark:bg-gray-800 tw:bg-white`} bg={darkMode ? `dark` : ``} text={darkMode ? `white` : ``}>
            <Card.Header className={`tw:border-0 tw:dark:bg-gray-800 tw:border-gray-700 tw:bg-white`}>
              <div className="tw:flex tw:justify-between tw:items-center">
                <h5 className={`tw:font-semibold tw:dark:text-white tw:text-gray-800`}>Workout Activity</h5>
                <div>
                  <button className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded-md tw:mr-2  tw:dark:bg-blue-900 tw:text-blue-300 tw:bg-blue-50 tw:text-blue-600`}>
                    Week
                  </button>
                  <button className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded-md tw:dark:text-gray-300 hover:tw:bg-gray-700 tw:text-gray-600 hover:tw:bg-gray-100`}>
                    Month
                  </button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className={`tw:h-80 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:dark:bg-gray-700 tw:bg-gray-50`}>
                <p className="tw:dark:text-gray-400 tw:text-gray-500">
                  Workout activity chart will appear here
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Recent Workouts */}
          <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:dark:bg-gray-800 tw:bg-white`}>
            <Card.Header className={`tw:border-0 tw:dark:bg-gray-800 tw:bg-white`}>
              <h5 className={`tw:font-semibold tw:dark:text-white tw:text-gray-800`}>Recent Workouts</h5>
            </Card.Header>
            <Card.Body>
              <div className="tw:overflow-x-auto">
                <table className="tw:min-w-full tw:divide-y tw:divide-gray-200">
                  <thead className='tw:dark:bg-gray-700 tw:bg-gray-50'>
                    <tr>
                      <th className={`tw:px-6 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:dark:text-gray-300 tw:text-gray-500`}>
                        Workout ID
                      </th>
                      <th className={`tw:px-6 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:dark:text-gray-300 tw:text-gray-500`}>
                        Type
                      </th>
                      <th className={`tw:px-6 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:dark:text-gray-300 tw:text-gray-500`}>
                        Date
                      </th>
                      <th className={`tw:px-6 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:dark:text-gray-300 tw:text-gray-500`}>
                        Duration
                      </th>
                      <th className={`tw:px-6 tw:py-3 tw:text-left tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:dark:text-gray-300 tw:text-gray-500`}>
                        Calories
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`tw:divide-y tw:dark:divide-gray-700 tw:bg-gray-800 tw:divide-gray-200 tw:bg-white`}>
                    {recentWorkouts.map((workout, index) => (
                      <tr key={index}>
                        <td className={`tw:px-6 tw:py-4 tw:whitespace-nowrap tw:text-sm tw:dark:text-blue-400 tw:text-blue-600`}>
                          {workout.id}
                        </td>
                        <td className={`tw:px-6 tw:py-4 tw:whitespace-nowrap tw:text-sm tw:dark:text-gray-300 tw:text-gray-500`}>
                          {workout.type}
                        </td>
                        <td className={`tw:px-6 tw:py-4 tw:whitespace-nowrap tw:text-sm tw:dark:text-gray-300 tw:text-gray-500`}>
                          {workout.date}
                        </td>
                        <td className={`tw:px-6 tw:py-4 tw:whitespace-nowrap tw:text-sm tw:dark:text-gray-300 tw:text-gray-500`}>
                          {workout.duration}
                        </td>
                        <td className={`tw:px-6 tw:py-4 tw:whitespace-nowrap tw:text-sm tw:dark:text-red-400 tw:text-red-600`}>
                          {workout.calories}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          {/* Fitness Goals */}
          <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:mb-4 tw:dark:bg-gray-800 tw:bg-white`}>
            <Card.Header className={`tw:border-0 tw:dark:bg-gray-800 tw:bg-white`}>
              <h5 className={`tw:font-semibold tw:dark:text-white tw:text-gray-800`}>Fitness Goals</h5>
            </Card.Header>
            <Card.Body>
              <div className="tw:space-y-4">
                {fitnessGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="tw:flex tw:justify-between tw:mb-1">
                      <span className={`tw:text-sm tw:font-medium tw:dark:text-gray-300 tw:text-gray-700`}>{goal.name}</span>
                      <span className={`tw:text-sm tw:dark:text-gray-400 tw:text-gray-500`}>{goal.target}</span>
                    </div>
                    <ProgressBar
                      now={goal.progress}
                      className="tw:h-2"
                      variant={
                        goal.progress > 70 ? 'success' :
                          goal.progress > 40 ? 'info' : 'warning'
                      }
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Upcoming Workouts */}
          <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:mb-4 tw:dark:bg-gray-800 tw:bg-white`}>
            <Card.Header className={`tw:border-0 tw:dark:bg-gray-800 tw:bg-white`}>
              <h5 className={`tw:font-semibold tw:dark:text-white tw:text-gray-800`}>Upcoming Workouts</h5>
            </Card.Header>
            <Card.Body>
              <div className="tw:space-y-4">
                {[
                  { name: 'Morning Run', time: 'Tomorrow, 7:00 AM', type: 'Cardio' },
                  { name: 'Strength Training', time: 'May 18, 6:00 PM', type: 'Strength' },
                  { name: 'Yoga Session', time: 'May 19, 8:00 AM', type: 'Flexibility' },
                ].map((workout, index) => (
                  <div key={index} className="tw:flex tw:items-start">
                    <div className={`tw:flex-shrink-0 tw:mt-1 tw:w-8 tw:h-8 tw:rounded-full ${workout.type === 'Cardio' ? 'tw:bg-red-100 tw:text-red-600' :
                      workout.type === 'Strength' ? 'tw:bg-blue-100 tw:text-blue-600' :
                        'tw:bg-purple-100 tw:text-purple-600'
                      } tw:flex tw:items-center tw:justify-center`}>
                      <FiActivity size={14} />
                    </div>
                    <div className="tw:ml-3">
                      <p className={`tw:text-sm tw:dark:text-white tw:text-gray-800`}>
                        <span className="tw:font-medium">{workout.name}</span>
                      </p>
                      <p className={`tw:text-xs tw:dark:text-gray-400 tw:text-gray-500 tw:mt-1`}>{workout.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className={`tw:shadow-sm tw:border-0 tw:rounded-lg tw:dark:bg-gray-800 tw:bg-white`}>
            <Card.Header className={`tw:border-0 tw:dark:bg-gray-800 tw:bg-white`}>
              <h5 className={`tw:font-semibold tw:dark:text-white tw:text-gray-800`}>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="tw:grid tw:grid-cols-2 tw:gap-4">
                <button className={`tw:p-3 tw:rounded-lg tw:text-center tw:flex tw:flex-col tw:items-center tw:dark:bg-blue-900 hover:tw:dark:bg-blue-800 tw:bg-blue-50 hover:tw:bg-blue-100`}>
                  <FiActivity className="tw:text-blue-500 tw:mb-1" size={20} />
                  <div className={`tw:text-sm tw:dark:text-blue-300 tw:text-blue-600`}>Start Workout</div>
                </button>
                <button className={`tw:p-3 tw:rounded-lg tw:text-center tw:flex tw:flex-col tw:items-center tw:dark:bg-green-900 hover:tw:dark:bg-green-800 tw:bg-green-50 hover:tw:bg-green-100`}>
                  <FiCalendar className="tw:text-green-500 tw:mb-1" size={20} />
                  <div className={`tw:text-sm tw:dark:text-green-300 tw:text-green-600`}>Schedule</div>
                </button>
                <button className={`tw:p-3 tw:rounded-lg tw:text-center tw:flex tw:flex-col tw:items-center tw:dark:bg-purple-900 hover:tw:dark:bg-purple-800 tw:bg-purple-50 hover:tw:bg-purple-100`}>
                  <FiPieChart className="tw:text-purple-500 tw:mb-1" size={20} />
                  <div className={`tw:text-sm tw:dark:text-purple-300 tw:text-purple-600`}>Progress</div>
                </button>
                <button className={`tw:p-3 tw:rounded-lg tw:text-center tw:flex tw:flex-col tw:items-center tw:dark:bg-yellow-900 hover:tw:dark:bg-yellow-800 tw:bg-yellow-50 hover:tw:bg-yellow-100`}>
                  <FiAward className="tw:text-yellow-500 tw:mb-1" size={20} />
                  <div className={`tw:text-sm tw:dark:text-yellow-300 tw:text-yellow-600`}>Challenges</div>
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard