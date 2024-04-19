<script>
import { ref, onMounted } from 'vue';
import HeaderComponent from '../components/TheHeader.vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
    components: {
        HeaderComponent,
        VueApexCharts,
    },
    data() {
        return {
            isLoading: true,
            series3: [],
            chartOptions3: {},
            series1: [],
            chartOptions1: {},
            selectedMonth: new Date().getMonth(),
            selectedEquipment: "FESEM/EDX(1)",
            startDate: null,
            endDate: null
        };
    },
    methods: {
        async getAllDepartment() {
            this.isLoading = true;
            try {
                const response = await fetch(`/api/getAllDepartment`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to get departments');

                const data = await response.json();
                this.series3 = Object.values(data);
                this.chartOptions3 = {
                    labels: Object.keys(data),
                    chart: {
                        type: 'pie',
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                };
                console.log('Labels:', this.chartOptions3.labels);

                console.log("Departments fetched successfully");
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
            this.isLoading = false;
        },
        async getUtilizationRate() {
            this.isLoading = true;
            try {
                const response = await fetch(`/api/getUtilization`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to get utilization rate');

                const data = await response.json();

                // const filteredData = data[this.selectedEquipment].filter(item => {
                //     const date = new Date(item.date);
                //     return date.getMonth() === this.selectedMonth - 1;
                // });

                let filteredData;
                if (this.selectedEquipment === 'all') {
                    // If "All Equipment" is selected, combine the data for all equipment
                    filteredData = Object.values(data).flat().filter(item => {
                        const date = new Date(item.date);
                        return date >= new Date(this.startDate) && date <= new Date(this.endDate);
                    });
                } else {
                    // Otherwise, filter the data for the selected equipment
                    filteredData = data[this.selectedEquipment].filter(item => {
                        const date = new Date(item.date);
                        return date >= new Date(this.startDate) && date <= new Date(this.endDate);
                    });
                }
                const totalBookedHours = filteredData.reduce((total, item) => total + item.bookedHours, 0);

                // Calculate the number of days between startDate and endDate
                const start = new Date(this.startDate);
                const end = new Date(this.endDate);
                const daysInPeriod = (end - start) / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates

                // Available hours: 8 hours per day and 'daysInPeriod' working days
                const totalAvailableHours = 24 * daysInPeriod;


                const utilizationRate = (totalBookedHours / totalAvailableHours) * 100; // Convert to percentage
                const remainingRate = 100 - utilizationRate;

                this.series1 = [utilizationRate, remainingRate];
                this.chartOptions1 = {
                    labels: ['Utilization Rate', 'Remaining Rate'],
                    chart: {
                        type: 'pie',
                    },
                    colors: ['#008FFB', '#00E396'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                };

                console.log("Utilization rate fetched successfully");
            } catch (error) {
                console.error('Error fetching utilization rate:', error);
            }
            this.isLoading = false;
        },
    },
    created() {
        this.getAllDepartment();
        this.getUtilizationRate();
    },
    mounted() {
        this.getAllDepartment();
        this.getUtilizationRate();
    },
    watch: {
        selectedMonth() {
            this.getUtilizationRate();
        },
        selectedEquipment() {
            this.getUtilizationRate();
        }
    },
};
</script>



<template>
    <HeaderComponent />
    <br>

    <div class="row" style="display: flex; align-items: center;">
    <div class="date-range-search-box" style="margin-bottom: 1rem">
        <span class="date-separator">Start Date:</span>
        <input type="date" class="start-date-input" placeholder="Start Date" v-model="startDate">
        <span class="date-separator">End Date:</span>
        <input type="date" class="end-date-input" placeholder="End Date" v-model="endDate">
        <!-- <button class="search-button" @click="updateChart">Search</button> -->
    </div>

    <div style="flex: 1; display: flex; justify-content: center;">
        <span>Select Equipment:</span>
        <select v-model="selectedEquipment" style="width: 200px;">
            <option value="all">All Equipment</option>
            <option value="FESEM/EDX(1)">FESEM/EDX(1)</option>
            <option value="FESEM/EDX(2)">FESEM/EDX(2)</option>
            <option value="ES2">ES2</option>
            <option value="XPS(1)">XPS(1)</option>
        </select>
    </div>
</div>

    <br>


    <div class="container" style="margin-bottom: 1rem;">
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Utilization Rate</div>
                    <vue-apex-charts type="pie" :options="chartOptions1" :series="series1"></vue-apex-charts>
                </div>
            </div>
            <!-- <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Distribution of users</div>
                    <apexchart type="pie" :options="chartOptions2" :series="series2" />
                </div>
            </div> -->
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Distribution of departments</div>
                    <vue-apex-charts type="pie" :series="series3" :options="chartOptions3"></vue-apex-charts>

                </div>
            </div>
        </div>
    </div>
</template>

<style>
.date-range-search-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.start-date-input,
.end-date-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.date-separator {
    margin: 0 8px;
}

.search-button {
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #337ab7;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-button:hover {
    background-color: #23527c;
}
</style>