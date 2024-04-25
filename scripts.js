document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    // Adds new topic inputs to the DOM
    function addTopicInput() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = `<div class="topicInput" data-topic-index="${index}">
                             <input type="text" name="topicTitle[]" placeholder="Topic Title" required />
                             <input type="number" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />
                         </div>`;
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
            durationInput.style.display = 'none'; // Hide duration inputs after submission
        });

        // Hide the inputs and buttons after topics are set
        document.getElementById('topicInputs').style.display = 'none';
        document.getElementById('addTopic').style.display = 'none';

        currentTopicIndex = 0;
        startNextTopic();
    });

    // Starts the timer for the current topic and highlights it
    function startNextTopic() {
        var previousActive = document.querySelector('.activeTopic');
        if (previousActive) {
            previousActive.classList.remove('activeTopic');
        }

        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;

            var currentInputBox = document.querySelector(`.topicInput[data-topic-index="${currentTopicIndex}"]`);
            if (currentInputBox) {
                currentInputBox.classList.add('activeTopic');
            }

            var timerInterval = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    if (currentInputBox) {
                        currentInputBox.classList.remove('activeTopic');
                    }
                    currentTopicIndex++;
                    if (currentTopicIndex < topics.length) {
                        startNextTopic();
                    } else {
                        document.getElementById('timerDisplay').textContent = "Meeting Over";
                    }
                } else {
                    timeLeft--;
                    document.getElementById('timerDisplay').textContent = formatTime(timeLeft);
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
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
});
