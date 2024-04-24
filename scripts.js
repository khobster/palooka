document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    // Adds new topic inputs to the DOM
    function addTopicInput() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = '<div class="topicInput" data-topic-index="' + index + '">' +
                            '<input type="text" name="topicTitle[]" placeholder="Topic Title" required />' +
                            '<input type="number" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />' +
                        '</div>';
        container.insertAdjacentHTML('beforeend', inputHTML);
    }

    // Listener for the 'Add Topic' button
    document.getElementById('addTopic').addEventListener('click', addTopicInput);

    // Handles the submission of topics and starts the timer
    document.getElementById('topicsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var topicTitles = document.querySelectorAll('input[name="topicTitle[]"]');
        var topicDurations = document.querySelectorAll('input[name="topicDuration[]"]');

        topics.length = 0; // Clear existing topics

        // Process each topic and display it
        topicTitles.forEach(function (titleInput, index) {
            var durationInput = topicDurations[index];
            var duration = parseInt(durationInput.value, 10) * 60; // Convert duration to seconds
            topics.push({ title: titleInput.value, duration: duration });
        });

        // Hide the inputs and buttons after topics are set
        document.getElementById('topicInputs').style.display = 'none';
        document.getElementById('addTopic').style.display = 'none';

        currentTopicIndex = 0;
        startNextTopic();
    });

    // Starts the timer for the current topic
    function startNextTopic() {
        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;

            // Display the current topic above the timer
            document.getElementById('timerDisplay').textContent = currentTopic.title;
            document.getElementById('timerDisplay').classList.add('activeTopic');

            var timerInterval = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    currentTopicIndex++;
                    if (currentTopicIndex < topics.length) {
                        document.getElementById('timerDisplay').classList.remove('activeTopic');
                        startNextTopic();
                    } else {
                        document.getElementById('timerDisplay').textContent = "Meeting Over";
                        document.getElementById('timerDisplay').classList.remove('activeTopic');
                    }
                } else {
                    timeLeft--;
                    document.getElementById('timerDisplay').setAttribute('data-time', formatTime(timeLeft));
                }
            }, 1000);
        } else {
            document.getElementById('timerDisplay').textContent = "Meeting Over"; // Display when the meeting is over
        }
    }

    // Formats the time for the timer
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return (minutes < 10 ? '0' : '') + minutes + ":" + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    }

    // Initializes the Jitsi Meet API
    function initializeJitsi(roomName) {
        var domain = 'meet.jit.si'; // Jitsi server domain
        var options = {
            roomName: encodeURIComponent(roomName),
            parentNode: document.getElementById('jitsi-meet'),
            width: '100%',
            height: '100%',
            configOverwrite: {
                requireDisplayName: false,
                startWithAudioMuted: false,
                prejoinPageEnabled: false
            },
            interfaceConfigOverwrite: {
                filmStripOnly: false,
                SHOW_JITSI_WATERMARK: false,
            }
        };

        // Start Jitsi Meet API with the options
        new JitsiMeetExternalAPI(domain, options);
        document.getElementById('jitsi-meet').style.display = 'block'; // Show the Jitsi iframe
        document.getElementById('roomForm').style.display = 'none'; // Hide the room form
    }

    // Event listener for room creation form submission
    var roomForm = document.getElementById('roomForm');
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var roomName = document.getElementById('roomName').value.trim();
        if (roomName) {
            initializeJitsi(roomName);
        } else {
            alert('Please enter a room name.'); // Alert for room name
        }
    });

    // Event listener for 'Share Session' button click
    document.getElementById('shareSession').addEventListener('click', function() {
        var roomName = document.getElementById('roomName').value.trim();
        var shareURL = window.location.href.split('?')[0] + '?room=' + encodeURIComponent(roomName);
        
        // Copy the session link to the clipboard
        navigator.clipboard.writeText(shareURL).then(function() {
            alert('Link copied to clipboard! Share it with others to join your Palooka session.');
        }).catch(function(err) {
            alert('Failed to copy link: ', err);
        });
    });

    // Check for the room name in the URL and join the room if present
    var urlParams = new URLSearchParams(window.location.search);
    var roomNameFromURL = urlParams.get('room');
    if(roomNameFromURL) {
        document.getElementById('roomName').value = roomNameFromURL;
        initializeJitsi(roomNameFromURL);
    }
});
