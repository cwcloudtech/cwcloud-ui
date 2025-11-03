import { useContext, useEffect, useState } from 'react';

import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import classes from './Chart.module.css';
import GlobalContext from '../../Context/GlobalContext';
import colors from '../../Context/Colors';
import Translate from "react-translate-component";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function UserAnalytics({ users }) {
    const context = useContext(GlobalContext);
    const _mode = context.mode || 'light';
    const [featuresData, setFeaturesData] = useState({ labels: [], data: [] });
    const [registrationData, setRegistrationData] = useState({ labels: [], data: [] });
    const [adminData, setAdminData] = useState({ labels: [], data: [] });

    useEffect(() => {
        if (users.length > 0) {
            processFeatureData();
            processRegistrationData();
            processAdminData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users]);

    const processFeatureData = () => {
        const features = {
            iotapi: 0,
            k8sapi: 0,
            daasapi: 0,
            faasapi: 0,
            emailapi: 0,
            ban: 0
        };

        users.forEach(user => {
            Object.keys(features).forEach(feature => {
                if (user.enabled_features[feature]) {
                    features[feature]++;
                }
            });
        });

        setFeaturesData({
            labels: Object.keys(features).map(f => f.toUpperCase()),
            data: Object.values(features)
        });
    };

    const processRegistrationData = () => {
        const months = {};
        users.forEach(user => {
            const date = new Date(user.created_at);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            months[monthYear] = (months[monthYear] || 0) + 1;
        });

        setRegistrationData({
            labels: Object.keys(months),
            data: Object.values(months)
        });
    };

    const processAdminData = () => {
        const adminCount = users.filter(user => user.is_admin).length;
        const nonAdminCount = users.length - adminCount;

        setAdminData({
            labels: ['Admins', 'Regular Users'],
            data: [adminCount, nonAdminCount]
        });
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: colors.mainText[_mode],
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: colors.mainText[_mode],
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: _mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: colors.mainText[_mode],
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: _mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    const chartStyle = {
        height: '400px',
        width: '400px'
    };

    const chartContainerStyle = {
        width: '400px',
        textAlign: 'center'
    };

    return (
        <div className={classes.mainContainer}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px',
                width: '100%',
                marginTop: '20px'
            }}>
                {/* Features Distribution */}
                <div style={chartContainerStyle}>
                    <h3 className={classes.chartTitle} style={{ color: colors.mainText[_mode] }}>
                        <Translate content="dashboard.usersPage.enabledFeaturesDistribution" />
                    </h3>
                    <div style={chartStyle}>
                        <Pie
                            data={{
                                labels: featuresData.labels,
                                datasets: [{
                                    data: featuresData.data,
                                    backgroundColor: [
                                        '#FF6384',
                                        '#36A2EB',
                                        '#FFCE56',
                                        '#4BC0C0',
                                        '#9966FF',
                                        '#FF9F40'
                                    ]
                                }]
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Monthly Registrations */}
                <div style={chartContainerStyle}>
                    <h3 className={classes.chartTitle} style={{ color: colors.mainText[_mode] }}>
                        <Translate content="dashboard.usersPage.monthlyUserRegistrations" />
                    </h3>
                    <div style={chartStyle}>
                        <Bar
                            data={{
                                labels: registrationData.labels,
                                datasets: [{
                                    label: 'New Users',
                                    data: registrationData.data,
                                    backgroundColor: '#36A2EB'
                                }]
                            }}
                            options={barChartOptions}
                        />
                    </div>
                </div>

                {/* Admin vs Regular Users */}
                <div style={chartContainerStyle}>
                    <h3 className={classes.chartTitle} style={{ color: colors.mainText[_mode] }}>
                        <Translate content="dashboard.usersPage.userRoleDistribution" />
                    </h3>
                    <div style={chartStyle}>
                        <Doughnut
                            data={{
                                labels: adminData.labels,
                                datasets: [{
                                    data: adminData.data,
                                    backgroundColor: ['#FF6384', '#36A2EB']
                                }]
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserAnalytics;