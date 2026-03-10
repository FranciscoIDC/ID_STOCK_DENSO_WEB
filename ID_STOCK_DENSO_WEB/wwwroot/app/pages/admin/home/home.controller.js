(function () {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', '$timeout', 'HomeService', 'AlertService'];

    function HomeController(self, $state, $timeout, HomeService, AlertService) {

        async function _Init() {
            try {
                _RegisterFunctions();
                _InitValues();

                let lastMoves = await _GetLastMovesAsync();
                self.lastMoves = lastMoves;

                $timeout(function () {
                    RefreshChart();
                }, 100);

                self.$apply();

            } catch (error) {
                self.lastMoves = [];
                self.$apply();
                console.error('❌ Error en Init:', error);
            }
        }

        function _InitValues() {
            let date = new Date();

            self.month = date;
            self.params = {
                'page': 0,
                'itemsPerPage': 0,
                'Month': (date.getMonth() + 1),
                'Year': date.getFullYear()
            };
            self.lastMoves = [];

            self.$watch("month", async function (newValue, oldValue) {
                try {
                    if (newValue === oldValue) return;

                    self.params = {
                        'page': 0,
                        'itemsPerPage': 0,
                        'Month': (newValue.getMonth() + 1),
                        'Year': newValue.getFullYear()
                    };

                    let lastMoves = await _GetLastMovesAsync();
                    self.lastMoves = lastMoves;
                    self.moves = self.lastMoves;

                    $timeout(function () {
                        RefreshChart();
                    }, 100);

                    self.$apply();

                } catch (error) {
                    self.lastMoves = [];
                    self.moves = [];
                    self.$apply();
                    console.error('❌ Error en watch month:', error);
                }
            });
        }

        function _RegisterFunctions() {
            self.moves = [];
            self.myChart = null;
        }

        async function _GetLastMovesAsync() {
            try {
                let response = await HomeService.GetLastMoves(self.params);
                const { Status, Message, Data } = response.data;
                console.log('✅ Home | _GetLastMovesAsync:', response.data);
                self.moves = Data || [];
                return Data || [];
            } catch (ex) {
                console.error('❌ Error obteniendo movimientos:', ex);
                throw ex;
            }
        }

        function _BuildChart() {
            if (typeof Chart === 'undefined') {
                console.error('❌ Chart.js no está cargado');
                return;
            }

            if (self.myChart) {
                self.myChart.destroy();
                self.myChart = null;
            }

            let canvas = document.getElementById('myChart');
            if (!canvas) {
                console.warn('⚠️ Canvas "myChart" no encontrado');
                return;
            }

            let context = canvas.getContext('2d');

            const config = {
                type: 'bar',
                data: {
                    labels: ['Sin datos'],
                    datasets: [{
                        label: 'Número de movimientos',
                        backgroundColor: ['rgba(139, 92, 246, 0.7)'],
                        borderColor: ['rgb(139, 92, 246)'],
                        data: [0],
                        borderWidth: 2,
                        borderRadius: 10,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 13, weight: '600', family: "'Inter', sans-serif" },
                                padding: 20,
                                usePointStyle: true,
                                color: '#1e293b'
                            }
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            padding: 14,
                            cornerRadius: 10,
                            callbacks: {
                                label: function (context) {
                                    return ' Movimientos: ' + context.parsed.y;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 12, weight: '500' },
                                color: '#64748b',
                                padding: 8
                            },
                            grid: { color: 'rgba(226, 232, 240, 0.7)', drawBorder: false }
                        },
                        x: {
                            ticks: {
                                font: { size: 12, weight: '600' },
                                color: '#1e293b',
                                padding: 8
                            },
                            grid: { display: false }
                        }
                    },
                    animation: { duration: 800, easing: 'easeInOutQuart' }
                }
            };

            try {
                self.myChart = new Chart(context, config);
                console.log('✅ Gráfica creada');
            } catch (error) {
                console.error('❌ Error creando gráfica:', error);
            }
        }

        function RefreshChart() {
            if (!self.moves || self.moves.length === 0) {
                console.log('ℹ️ Sin movimientos para graficar');
                if (self.myChart) {
                    self.myChart.destroy();
                    self.myChart = null;
                }
                return;
            }

            if (!self.myChart) {
                _BuildChart();
            }

            if (!self.myChart) {
                console.error('❌ No se pudo inicializar la gráfica');
                return;
            }

            const chartColors = [
                { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' },
                { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgb(16, 185, 129)' },
                { bg: 'rgba(6, 182, 212, 0.7)', border: 'rgb(6, 182, 212)' },
                { bg: 'rgba(245, 158, 11, 0.7)', border: 'rgb(245, 158, 11)' },
                { bg: 'rgba(236, 72, 153, 0.7)', border: 'rgb(236, 72, 153)' },
                { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' }
            ];

            let labels = self.moves.map(i => i.Name || 'Sin nombre');
            let dataValues = self.moves.map(i => i.NumberOfMoves || 0);
            let bgColors = dataValues.map((_, i) => chartColors[i % chartColors.length].bg);
            let borderColors = dataValues.map((_, i) => chartColors[i % chartColors.length].border);

            self.myChart.data.labels = labels;
            self.myChart.data.datasets[0].data = dataValues;
            self.myChart.data.datasets[0].backgroundColor = bgColors;
            self.myChart.data.datasets[0].borderColor = borderColors;

            self.myChart.update();
            console.log('✅ Gráfica actualizada —', dataValues.length, 'elementos');
        }

        _Init();
    }
})();