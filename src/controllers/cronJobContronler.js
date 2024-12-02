import connection from "../config/connectDB";
import winGoController from "./winGoController";
import k5Controller from "./k5Controller";
import k3Controller from "./k3Controller";
import cron from 'node-cron';
const axios = require('axios');
let userInput = null; 
let userInputReceived = false;
const cronJobGame1p = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Capture the input from the frontend
        socket.on('user-input', (input) => {
            console.log("User input received:", input);
            userInput = input; // Store the input in the global variable
            userInputReceived = true; // Set the flag to true when input is received
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    function generateUniqueID() {
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        const date = new Date(now);
        const year = date.getFullYear().toString();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const totalMinutes = (hours * 60) + minutes + 1;
        const timePeriod = ('00000' + totalMinutes).slice(-5);
        const uniqueID = `${year}${month}${day}${timePeriod}`;

        return uniqueID;
    }

    cron.schedule('*/1 * * * *', async () => {
        try {
            // Fetch data from API
            const response = await axios.get(`https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=&end_timestamp=`);
            const data = response.data.data;
            const targetBlockData = data[2];
            const block = targetBlockData.number;
            let hash = targetBlockData.hash;

            // If user input was received, modify the hash accordingly
            if (userInputReceived) {
                switch (userInput) {
                    case '1': hash += 'bcd1a'; break;
                    case '2': hash += 'c3da2'; break;
                    case '3': hash += 'fea3b'; break;
                    case '4': hash += 'fe1a34'; break;
                    case '5': hash += '63fe5'; break;
                    case '6': hash += 'f6aeb'; break;
                    case '7': hash += '7eabb'; break;
                    case '8': hash += '23a38'; break;
                    case '9': hash += 'ea9cf'; break;
                }
                userInputReceived = false; // Reset the flag after processing
                userInput = null; // Clear the user input
            }

            const lastFiveChars = hash.slice(-5);

            // Emit the hash to the client
            io.emit('data-server-hash', { data: lastFiveChars });

            // Find the last digit of the hash
            function findLastIntegerDigit(hash) {
                for (let i = hash.length - 1; i >= 0; i--) {
                    if (!isNaN(hash[i]) && hash[i] !== ' ') {
                        return hash[i];
                    }
                }
                return null;
            }

            const result = findLastIntegerDigit(hash);
            await winGoController.trxhandlingWinGo1P(1, result);

            const currentTime = new Date();
            const adjustedTime = new Date(currentTime.getTime() - 3000);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Kolkata'
            };
            const time = new Intl.DateTimeFormat('en-GB', options).format(adjustedTime).replace(',', '');
            const formattedTime = time.replace(/(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6');
            const bigsmall = result <= 4 ? 'small' : 'big';
            const status = 0;
            const singleType = 1;
            const uniqueID = generateUniqueID();

            const query = 'INSERT INTO trx (period, block, hash, result, bigsmall, time, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [uniqueID, block, hash, result, bigsmall, formattedTime, status, singleType];

            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return;
                }
                console.log('Data inserted:', results.insertId);
            });

        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    });
    // trx 30 seocund ////
    cron.schedule('*/30 * * * * *', async () => {
        try {
            // Fetch data from API
            const response = await axios.get(`https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=&end_timestamp=`);
            const data = response.data.data;
            const targetBlockData = data[2];
            const block = targetBlockData.number;
            let hash = targetBlockData.hash;

            // If user input was received, modify the hash accordingly
            if (userInputReceived) {
                switch (userInput) {
                    case '1': hash += 'bcd1a'; break;
                    case '2': hash += 'c3da2'; break;
                    case '3': hash += 'fea3b'; break;
                    case '4': hash += 'fe1a34'; break;
                    case '5': hash += '63fe5'; break;
                    case '6': hash += 'f6aeb'; break;
                    case '7': hash += '7eabb'; break;
                    case '8': hash += '23a38'; break;
                    case '9': hash += 'ea9cf'; break;
                }
                userInputReceived = false; // Reset the flag after processing
                userInput = null; // Clear the user input
            }

            const lastFiveChars = hash.slice(-5);

            // Emit the hash to the client
            io.emit('data-server-hash', { data: lastFiveChars });

            // Find the last digit of the hash
            function findLastIntegerDigit(hash) {
                for (let i = hash.length - 1; i >= 0; i--) {
                    if (!isNaN(hash[i]) && hash[i] !== ' ') {
                        return hash[i];
                    }
                }
                return null;
            }

            const result = findLastIntegerDigit(hash);
            await winGoController.trxhandlingWinGo1P(3, result);

            const currentTime = new Date();
            const adjustedTime = new Date(currentTime.getTime() - 3000);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Kolkata'
            };
            const time = new Intl.DateTimeFormat('en-GB', options).format(adjustedTime).replace(',', '');
            const formattedTime = time.replace(/(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6');
            const bigsmall = result <= 4 ? 'small' : 'big';
            const status = 0;
            const singleType = 3;
            const uniqueID = generateUniqueID();

            const query = 'INSERT INTO trx (period, block, hash, result, bigsmall, time, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [uniqueID, block, hash, result, bigsmall, formattedTime, status, singleType];

            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return;
                }
                console.log('Data inserted:', results.insertId);
            });

        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    });



    // >>>>>>>>>>>>>>>>>>>
    // io.on('connection', (socket) => {
    //     console.log('A user connected');

    //     // Capture the input from the frontend
    //     socket.on('user-input', (input) => {
    //         console.log("User input received:", input);
    //         userInput = input; // Store the input in the global variable
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('User disconnected');
    //     });
    // });
    
    cron.schedule('*/1 * * * *', async() => {
        // console.log("enter in crone job....1")
        await winGoController.addWinGo(1);
        // console.log("pass code is add wingo ......")
        await winGoController.handlingWinGo1P(1);
        // console.log("pass haflingwingo1p.......")
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        // console.log("data is .....",data)
        io.emit('data-server', { data: data });

        await k5Controller.add5D(1);
        await k5Controller.handling5D(1);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '1' });

        await k3Controller.addK3(1);
        await k3Controller.handlingK3(1);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '1' });
    });

    cron.schedule('*/3 * * * *', async() => {
        await winGoController.addWinGo(3);
        await winGoController.handlingWinGo1P(3);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(3);
        await k5Controller.handling5D(3);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '3' });

        await k3Controller.addK3(3);
        await k3Controller.handlingK3(3);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '3' });
    });

    cron.schedule('*/5 * * * *', async() => {
        await winGoController.addWinGo(5);
        await winGoController.handlingWinGo1P(5);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(5);
        await k5Controller.handling5D(5);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '5' });

        await k3Controller.addK3(5);
        await k3Controller.handlingK3(5);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '5' });
    });
    
    cron.schedule('*/10 * * * *', async() => {
        await winGoController.addWinGo(10);
        await winGoController.handlingWinGo1P(10);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        
        await k5Controller.add5D(10);
        await k5Controller.handling5D(10);
        const [k5D] = await connection.execute('SELECT * FROM 5d WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '10' });

        await k3Controller.addK3(10);
        await k3Controller.handlingK3(10);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '10' });
    });

//     function generateUniqueID() {
//         const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
//         const date = new Date(now);
//         const year = date.getFullYear().toString();
//         const month = ('0' + (date.getMonth() + 1)).slice(-2);
//         const day = ('0' + date.getDate()).slice(-2);
    
//         // Get the hours, minutes, and seconds
//         const hours = date.getHours();
//         const minutes = date.getMinutes();
//         const seconds = date.getSeconds();
//         const totalMinutes = (hours * 60) + minutes+1;
//         const timePeriod = ('00000' + totalMinutes).slice(-5);
//         const uniqueID = `${year}${month}${day}${timePeriod}`;
    
//         return uniqueID;
//     }
//     const id = generateUniqueID();
//     console.log("Generated ID:", id);
    
//     cron.schedule('*/1 * * * *', async () => {
//         try {
//             console.log("trx 1 minute.....")
//             // await winGoController.trxhandlingWinGo1P(1);
//     const response = await axios.get(`https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=&end_timestamp=`, {
// });
// // console.log("response as ...",response)
// const data = response.data.data;
// const currentBlockNumber = data[0].number;
//         const targetBlockIndex = 2;
//         const targetBlockData = data[targetBlockIndex];
//         const block = targetBlockData.number;
//         let hash = targetBlockData.hash;

//         // const userInput = req.body.editResult || null;  // Assuming form input is named 'editResult'

//         // If user input exists and equals '1', append the hardcoded value to the hash
//         if (userInput == 1) {
//             hash += 'bcd1a';  // Append the hardcoded value to the hash
//         } else if (userInput == 2) {
//             hash += 'c3da2';
//         } else if (userInput == 3) {
//             hash += 'fea3b';
//         } else if (userInput == 4) {
//             hash += 'fe1a34';
//         } else if (userInput == 5) {
//             hash += '63fe5';
//         } else if (userInput == 6) {
//             hash += 'f6aeb';
//         } else if (userInput == 7) {
//             hash += '7eabb';
//         } else if (userInput == 8) {
//             hash += '23a38';
//         } else if (userInput == 9) {
//             hash += 'ea9cf';
//         }else{
//             hash=hash
//         }
        
//         const lastFiveChars = hash.slice(-5);
//         io.emit('data-server-hash', { data: lastFiveChars});
// function findLastIntegerDigit(hash) {
//     for (let i = hash.length - 1; i >= 0; i--) {
//         if (!isNaN(hash[i]) && hash[i] !== ' ') {
//             return hash[i];
//         }
//     }
//     return null;
// }
// const  result= findLastIntegerDigit(hash);
// await winGoController.trxhandlingWinGo1P(1,result);
//     const currentTime = new Date();
//     const adjustedTime = new Date(currentTime.getTime() - 3000);
// const options = {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     timeZone: 'Asia/Kolkata'
// };
// const time = new Intl.DateTimeFormat('en-GB', options).format(adjustedTime).replace(',', '');
// const formattedTime = time.replace(/(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6');
//             const bigsmall = result <= 4 ? 'small' : 'big';
//             const status = 0;
//             const singleType = 1;
//             const uniqueID = generateUniqueID();
//             console.log("as....d....")
//             const query = 'INSERT INTO trx (period, block, hash, result, bigsmall, time, status,type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//             const values = [uniqueID, block, hash, result, bigsmall, formattedTime, status, singleType]; // Assuming period can be null or auto-increment
//             console.log("inset data is ....",uniqueID, block, hash, result, bigsmall, formattedTime, status, singleType)
//             connection.query(query, values, (err, results) => {
//                 if (err) {
//                     console.error('Error inserting data:', err);
//                     return;
//                 }
//                 console.log('Data inserted:', results.insertId);
                
//             });
            
//         } catch (error) {
//             console.error('Error fetching data from API:');
//         }
//     })
    // display data 
    cron.schedule('*/5 * * * * *',async()=>{
        const [singletrxgetDatachart] = await connection.execute('SELECT * FROM trx WHERE type = 1 ORDER BY id DESC LIMIT 10', []);
        const singletrxdatachart = singletrxgetDatachart.map(items => {
            return items;
          });
        //   console.log("single chart data is ...",singletrxdatachart)
        io.emit('data-server-trx-chart', { data: singletrxdatachart });
        
    })
    cron.schedule('*/1 * * * *', async () => {
        
        const [singletrxgetData] = await connection.execute('SELECT * FROM trx WHERE type = 1 ORDER BY id DESC LIMIT 10', []);
        const singletrxdata = singletrxgetData.map(items => {
            items.hash = items.hash.slice(-4);
            items.time = items.time.split(' ')[1];
          
            // Format period field as per your requirement
            const formattedPeriod = `202**${items.period.toString().slice(-4)}`;
            items.period = formattedPeriod;
          
            // Return the modified item
            return items;
          });
        //   console.log("singletrxdata is...",singletrxdata)
        io.emit('data-server-trx', { data: singletrxdata });

        // >>>>>>>>>>>>>>>>>>>> in every 3 secound display as 3 minute data >>>>>>>
    })
    cron.schedule('*/30 * * * * *', async () => {
        console.log("enter in 3o secound...")
        
        const [tharteesecoundtrxgetData] = await connection.execute('SELECT * FROM trx WHERE type = 3 ORDER BY id DESC LIMIT 10', []);
        const thartitrxdata = tharteesecoundtrxgetData.map(items => {
            items.hash = items.hash.slice(-4);
            items.time = items.time.split(' ')[1];
          
            // Format period field as per your requirement
            const formattedPeriod = `202**${items.period.toString().slice(-4)}`;
            items.period = formattedPeriod;
          
            // Return the modified item
            return items;
          });
        //   console.log("30 secound data is ....",thartitrxdata)
        //   console.log("singletrxdata is...",singletrxdata)
        io.emit('data-server-trx-30', { data: thartitrxdata });

        // >>>>>>>>>>>>>>>>>>>> in every 3 secound display as 3 minute data >>>>>>>
    })
    cron.schedule('*/1 * * * * *', async () => {
        const [singletrxgetperiod] = await connection.execute('SELECT * FROM trx WHERE type = 1 ORDER BY id DESC LIMIT 1', []);
            const singletrxPeriodData=singletrxgetperiod[0].period +1;
            const lastFiveChars = singletrxgetperiod[0].hash.slice(-5);
            // console.log("hash value is ...",lastFiveChars)
            io.emit('data-server-hash', { data: lastFiveChars});
            // console.log("single trx period data is ...",singletrxPeriodData)
            io.emit('data-server-trx-get-period', { data: singletrxPeriodData });
            
        // >>>>>>>>>>>>>>>>>>>> in every 3 secound display as 3 minute data >>>>>>>
    })
    cron.schedule('*/30 * * * * *', async () => {
        const [thirtintrxgetperiod] = await connection.execute('SELECT * FROM trx WHERE type = 3 ORDER BY id DESC LIMIT 1', []);
            const thirtingtrxPeriodData=thirtintrxgetperiod[0].period +2;
            const thirtinlastFiveChars = thirtintrxgetperiod[0].hash.slice(-5);
            // console.log("hash value is ...",lastFiveChars)
            io.emit('data-server-hash-30sec', { data: thirtinlastFiveChars});
            // console.log("single trx period data is ...",singletrxPeriodData)
            io.emit('data-server-trx-get-period-30sec', { data: thirtingtrxPeriodData });
            
        // >>>>>>>>>>>>>>>>>>>> in every 3 secound display as 3 minute data >>>>>>>
    })

// admin  

    cron.schedule('*/1 * * * *', async () => {
        try {
            
            console.log("enter con job for q....")

            const getLatestBlock = async () => {
                try {
                    const [rows] = await connection.query('SELECT * FROM trx WHERE type=1 ORDER BY id DESC LIMIT 1');
                    if (rows.length > 0) {
                        return rows[0];
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error('Error fetching latest block:', error);
                    return null;
                }
            };
    
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
            const performIncrementalOperation = async () => {
                const latestBlock = await getLatestBlock();
                if (!latestBlock) {
                    console.error('No block data found');
                    return;
                }
            console.log("b.....s...")
                let currentBlock = latestBlock.block;
                console.log("current bolck is ...",currentBlock)
                let currentTimeString = latestBlock.time;
                let [datePart, timePart] = currentTimeString.split(' '); // Split date and time parts
                let [day, month, year] = datePart.split('/').map(Number); // Split and parse date parts
                let [hours, minutes, seconds] = timePart.split(':').map(Number); // Split and parse time parts
                const secondIncrement = Math.floor(seconds / 3); // Increment value based on the given logic
            
                let iterationCount = 0;
                const totalIterations = 20;
                const resultsHistory = []; // Array to store the last 5 results
            
                const intervalId = setInterval(async () => {
                    iterationCount++;
                    currentBlock += 1;
                    seconds += secondIncrement;
                    if (seconds >= 60) {
                        minutes += Math.floor(seconds / 60);
                        seconds = seconds % 60;
                    }
                    if (minutes >= 60) {
                        hours += Math.floor(minutes / 60);
                        minutes = minutes % 60;
                    }
                    if (hours >= 24) {
                        hours = hours % 24;
                    }
            
                    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format time as HH:mm:ss
            
                    try {
                        const response = await axios.get('https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=&end_timestamp=', {
                            // params: {
                            //     number: currentBlock
                            // }
                        });
                        const data = response.data.data[0];
                        const block = data.number;
                        // console.log("block details ....",block)
                        const hash = data.hash;
                        // console.log("hash send data ...",hash)
                        function findLastIntegerDigit(hash) {
                            for (let i = hash.length - 1; i >= 0; i--) {
                                if (!isNaN(hash[i]) && hash[i] !== ' ') {
                                    return hash[i];
                                }
                            }
                            return null;
                        }
                        const  results= findLastIntegerDigit(hash);
                        // const results = data.result;
                        const bigsmall = results <= 4 ? 'small' : 'big';
                        let blockData = {
                            serial: iterationCount,
                            block: block,
                            time: formattedTime,
                            result: results,
                            bigsmall: bigsmall
                        };
            // console.log("block data as ....",blockData)
                        // Add the new result to the history array
                        resultsHistory.push(blockData);
            
                        // Keep only the last 5 results
                        if (resultsHistory.length > 10) {
                            resultsHistory.shift();
                        }
            
                        io.emit('data-server-trx-three-secound', { data: resultsHistory }); // Emit the history of the last 5 results
                        // console.log('Block:', blockData);
                    } catch (error) {
                        console.error('Error fetching block result:', error);
                    }
            
                    if (iterationCount >= totalIterations) {
                        clearInterval(intervalId); // Clear the interval after 20 iterations
                        console.log('Completed 20 intervals, waiting for 60 seconds before fetching new data...');
                        await delay(2000); // Wait for 60 seconds
                        // performIncrementalOperation(); // Recursively call to restart the process
                    }
                }, 3000); // Run every 2 seconds
            };
            performIncrementalOperation();
        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    })
    
    cron.schedule('0 1 * * *', async() => {
        await connection.execute('UPDATE users SET roses_today = ?', [0]);
        await connection.execute('UPDATE point_list SET money = ?', [0]);
        await connection.execute('UPDATE turn_over SET daily_turn_over = ?', [0]);
    });
}

module.exports = {
    cronJobGame1p
};