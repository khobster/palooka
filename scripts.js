document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    function addTopicInput() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = '<div class="topicInput" data-topic-index="' + index + '">' +
                            '<input type="text" name="topicTitle[]" placeholder="Topic Title" required />' +
                            '<input type="number" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />' +
                        '</div>';
        container.insertAdjacentHTML('beforeend', inputHTML);
    }

    document.getElementById('addTopic').addEventListener('click', addTopicInput);

    document.getElementById('topicsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var topicTitles = document.querySelectorAll('input[name="topicTitle[]"]');
        var topicDurations = document.querySelectorAll('input[name="topicDuration[]"]');

        topics.length = 0; // Clear existing topics

        topicTitles.forEach(function (titleInput, index) {
            topics.push({ title: titleInput.value, duration: parseInt(topicDurations[index].value, 10) * 60 });
        });

        // Hide the form after topics are set
        document.getElementById('topicsForm').style.display = 'none';

        currentTopicIndex = 0;
        startNextTopic();
    });

    function startNextTopic() {
        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;

            // Display the current topic and update the timer
            document.getElementById('timerDisplay').textContent = currentTopic.title;
            document.getElementById('timerDisplay').classList.add('activeTopic');

            var timerInterval = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    currentTopicIndex++;
                    if (currentTopicIndex < topics.length) {
                        document.getElementById('timerDisplay').classList.remove('activeTopic');
                        startNextTopic(); // Start the next topic timer
                    } else {
                        document.getElementById('timerDisplay').textContent = "Meeting Over"; // Display when the meeting is over
                        document.getElementById('timerDisplay').classList.remove('activeTopic');
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

    // ... existing code for Jitsi Meet initialization and sharing the session

    // ... existing code to check the URL and auto-join a room
});
