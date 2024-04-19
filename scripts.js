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

        topics = [];
        for (var i = 0; i < topicTitles.length; i++) {
            var duration = parseInt(topicDurations[i].value, 10) * 60;
            topics.push({ title: topicTitles[i].value, duration: duration });
            topicDurations[i].style.display = 'none';
        }

        currentTopicIndex = 0;
        startNextTopic();
    });

    function startNextTopic() {
        var previousActive = document.querySelector('.topicInput.activeTopic');
        if (previousActive) {
            previousActive.classList.remove('activeTopic');
        }

        if (currentTopicIndex < topics.length) {
            var currentTopic = topics[currentTopicIndex];
            var timeLeft = currentTopic.duration;
            var timerDisplay = document.getElementById('timerDisplay');
            var currentInputBox = document.querySelector('.topicInput[data-topic-index="' + currentTopicIndex + '"]');

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
                    startNextTopic();
                } else {
                    var minutes = Math.floor(timeLeft / 60);
                    var seconds = timeLeft % 60;
                    var timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
                    timerDisplay.textContent = timeString;
                    timeLeft--;
                }
            }, 1000);
        } else {
            document.getElementById('timerDisplay').textContent = 'Meeting Over';
        }
    }

    // Room creation form handler
    var roomForm = document.getElementById('roomForm');
    var roomNameInput = document.getElementById('roomName');

    roomForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var roomName = roomNameInput.value.trim();
        if (roomName) {
            var iframe = document.getElementById('jitsi-meet');
            iframe.src = 'https://meet.jit.si/' + encodeURIComponent(roomName);
            iframe.style.display = 'block';
            roomForm.style.display = 'none';
        }
    });

    roomNameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form action
            roomForm.dispatchEvent(new Event('submit')); // Programmatically trigger the form submission
        }
    });
});
