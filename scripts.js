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
            var duration = parseInt(topicDurations[index].value, 10) * 60;
            topics.push({ title: titleInput.value, duration: duration });
            topicDurations[index].style.display = 'none'; // Hide the duration input
        });

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
            var currentInputBox = document.querySelector('.topicInput[data-topic-index="' + currentTopicIndex + '"]');
            if (currentInputBox) {
                currentInputBox.classList.add('activeTopic');
            }

            var timerInterval = setInterval(function () {
                var minutes = Math.floor(timeLeft / 60);
                var seconds = timeLeft % 60;
                var timeString = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                document.getElementById('timerDisplay').textContent = timeString;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    if (currentInputBox) {
                        currentInputBox.classList.remove('activeTopic');
                    }
                    currentTopicIndex++;
                    if (currentTopicIndex < topics.length) {
                        startNextTopic(); // Recursive call
                    } else {
                        document.getElementById('timerDisplay').textContent = "Meeting Over";
                    }
                } else {
                    timeLeft--;
                }
            }, 1000);
        } else {
            document.getElementById('timerDisplay').textContent = "Meeting Over";
        }
    }

    // Handling the room creation form
    var roomForm = document.getElementById('roomForm');
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var roomName = document.getElementById('roomName').value.trim();
        if (roomName) {
            var domain = 'meet.jit.si'; // Use your Jitsi server if self-hosted
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
            
            new JitsiMeetExternalAPI(domain, options);
            document.getElementById('jitsi-meet').style.display = 'block';
            roomForm.style.display = 'none';
        } else {
            alert('Please enter a room name.'); // Alert the user to enter a room name
        }
    });
});
