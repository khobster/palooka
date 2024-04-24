import { CLIENT_ID, CLIENT_SECRET } from './config.js'; // Import client ID and client secret

document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    // Zoom SDK Client
    const client = ZoomMtgEmbedded.createClient();
    let meetingSDKElement = document.getElementById('meetingSDKElement');

    // Configuration for Zoom Meeting
    var authEndpoint = 'https://pggibbhorojif6jzsokz32dqlq0kmlmk.lambda-url.us-east-2.on.aws/';
    var sdkKey = 'Your_SDK_Key';  // Replace 'Your_SDK_Key' with your actual Zoom SDK key
    var meetingNumber = 'Your_Meeting_Number';  // Replace with actual meeting number
    var passWord = 'Your_Meeting_Password';  // Optional: Meeting password
    var role = 0; // 0 for participant, 1 for host
    var userName = 'Participant Name';
    var userEmail = 'Participant Email';
    var registrantToken = '';
    var zakToken = '';

    // Function to fetch signature and start meeting
    function getSignature() {
        fetch(authEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meetingNumber: meetingNumber,
                role: role
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            startMeeting(data.signature);
        }).catch(error => {
            console.error('Error getting signature:', error);
        });
    }

    function startMeeting(signature) {
        client.init({
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            patchJsMedia: true
        }).then(() => {
            client.join({
                signature: signature,
                sdkKey: sdkKey,
                meetingNumber: meetingNumber,
                password: passWord,
                userName: userName,
                userEmail: userEmail,
                tk: registrantToken,
                zak: zakToken
            }).then(() => {
                console.log('Joined meeting successfully');
            }).catch(error => {
                console.error('Error joining meeting:', error);
            });
        }).catch(error => {
            console.error('Error initializing Zoom SDK:', error);
        });
    }

    // Topic management
    document.getElementById('addTopic').addEventListener('click', function() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = `
            <div class="topicInput" data-topic-index="${index}">
                <input type="text" name="topicTitle[]" placeholder="Topic Title" required />
                <input type="number" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />
            </div>`;
        container.insertAdjacentHTML('beforeend', inputHTML);
    });

    document.getElementById('topicsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var topicTitles = document.querySelectorAll('input[name="topicTitle[]"]');
        var topicDurations = document.querySelectorAll('input[name="topicDuration[]"]');

        topics = Array.from(topicTitles).map(function(titleInput, index) {
            return {
                title: titleInput.value,
                duration: parseInt(topicDurations[index].value, 10) * 60
            };
        });

        document.getElementById('topicsForm').style.display = 'none';
        currentTopicIndex = 0;
        startNextTopic();
    });

    function startNextTopic() {
        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;

            document.getElementById('timerDisplay').textContent = currentTopic.title;
            document.getElementById('timerDisplay').classList.add('activeTopic');

            var timerInterval = setInterval(function() {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    currentTopicIndex++;
                    document.getElementById('timerDisplay').classList.remove('activeTopic');
                    if (currentTopicIndex < topics.length) {
                        startNextTopic();
                    } else {
                        document.getElementById('timerDisplay').textContent = "Meeting Over";
                    }
                } else {
                    timeLeft--;
                    document.getElementById('timerDisplay').setAttribute('data-time', formatTime(timeLeft));
                }
            }, 1000);
        }
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return (minutes < 10 ? '0' : '') + minutes + ":" + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    }
});
