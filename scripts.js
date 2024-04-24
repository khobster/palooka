document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

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

    var zoomForm = document.getElementById('zoomForm');
    zoomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var apiKey = document.getElementById('apiKey').value.trim();
        var apiSecret = document.getElementById('apiSecret').value.trim();
        var meetingId = document.getElementById('meetingId').value.trim();
        var accessToken = document.getElementById('accessToken').value.trim();

        if (apiKey && apiSecret && meetingId && accessToken) {
            initializeZoom(apiKey, apiSecret, meetingId, accessToken);
        } else {
            alert('Please fill in all Zoom API credentials.');
        }
    });

    function initializeZoom(apiKey, apiSecret, meetingId, accessToken) {
        // Initialize Zoom meeting using provided credentials
        // Use Zoom Web SDK functions to start the meeting
        // Display Zoom meeting interface within the 'zoom-meeting' div
    }
});
