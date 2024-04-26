document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    function addTopicInput() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = `<div class="topicInput" data-topic-index="${index}">
                             <input type="text" class="topicTitle" name="topicTitle[]" placeholder="Topic Title" required />
                             <input type="number" class="topicDuration" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />
                         </div>`;
        container.insertAdjacentHTML('beforeend', inputHTML);
    }

    document.getElementById('addTopic').addEventListener('click', addTopicInput);

    document.getElementById('topicsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var topicTitles = document.querySelectorAll('.topicTitle');
        var topicDurations = document.querySelectorAll('.topicDuration');

        topics = [];
        topicTitles.forEach(function (titleInput, index) {
            var durationInput = topicDurations[index];
            var duration = parseInt(durationInput.value, 10) * 60; // Convert minutes to seconds
            topics.push({ title: titleInput.value, duration: duration });
            durationInput.style.display = 'none'; // Hide only the duration inputs
        });

        // Hide the "Add Topic" button and the form submit button
        document.getElementById('addTopic').style.display = 'none';
        this.querySelector('button[type="submit"]').style.display = 'none';

        currentTopicIndex = 0;
        startNextTopic();
    });

    function startNextTopic() {
        var previousActive = document.querySelector('.activeTopic');
        if (previousActive) {
            // Remove active styling and show the title input as a plain text
            previousActive.classList.remove('activeTopic');
            var titleInput = previousActive.querySelector('.topicTitle');
            titleInput.disabled = true; // Disable the input to make it read-only
            titleInput.style.border = 'none'; // Remove border to look like plain text
            titleInput.style.backgroundColor = 'transparent'; // Remove background
            titleInput.style.color = 'black'; // Set text color to default or any color you want
        }

        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;

            // Highlight the current topic
            var topicInputs = document.querySelectorAll('.topicInput');
            var currentInputBox = topicInputs[currentTopicIndex];
            currentInputBox.classList.add('activeTopic');

            var timerInterval = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
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
            document.getElementById('timerDisplay').textContent = "Meeting Over";
        }
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
});
