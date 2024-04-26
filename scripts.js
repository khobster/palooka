document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');
    var addTopicButton = document.getElementById('addTopic');
    var startTalkingButton = document.querySelector('button[type="submit"]'); // Assuming there's only one submit button

    function addTopicInput() {
        var container = document.getElementById('topicInputs');
        var index = container.children.length;
        var inputHTML = `<div class="topicInput" data-topic-index="${index}">
                             <input type="text" name="topicTitle[]" placeholder="Topic Title" required />
                             <input type="number" name="topicDuration[]" placeholder="🕒" min="1" max="240" required />
                         </div>`;
        container.insertAdjacentHTML('beforeend', inputHTML);
    }

    addTopicButton.addEventListener('click', addTopicInput);

    document.getElementById('topicsForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var topicTitles = document.querySelectorAll('input[name="topicTitle[]"]');
        var topicDurations = document.querySelectorAll('input[name="topicDuration[]"]');

        topics = [];
        topicTitles.forEach(function (titleInput, index) {
            var durationInput = topicDurations[index];
            var duration = parseInt(durationInput.value, 10) * 60; // Convert minutes to seconds
            topics.push({ title: titleInput.value, duration: duration });
            titleInput.style.display = 'none'; // Hide title input
            durationInput.style.display = 'none'; // Hide duration input
        });

        addTopicButton.style.display = 'none'; // Hide "Add Topic" button
        startTalkingButton.style.display = 'none'; // Hide "Start Talking" button

        currentTopicIndex = 0;
        startNextTopic();
    });

    function startNextTopic() {
        var previousActive = document.querySelector('.activeTopic');
        if (previousActive) {
            previousActive.classList.remove('activeTopic');
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
                    currentInputBox.classList.remove('activeTopic');
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
            document.getElementById('timerDisplay').textContent = "Meeting Over"; // Display when all topics are covered
        }
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
});
