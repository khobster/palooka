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
            var durationInput = topicDurations[index];
            var duration = parseInt(durationInput.value, 10) * 60;
            topics.push({ title: titleInput.value, duration: duration });
            titleInput.style.display = 'none'; // Hide the title input
            durationInput.style.display = 'none'; // Hide the duration input
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
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    bellSound.play();
                    if (currentInputBox) {
                        currentInputBox.classList.remove('activeTopic');
                    }
                    currentTopicIndex++;
                    startNextTopic();
                } else {
                    timeLeft--;
                    var minutes = Math.floor(timeLeft / 60);
                    var seconds = timeLeft % 60;
                    var timeString = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                    document.getElementById('timerDisplay').textContent = timeString;
                }
            }, 1000);
        } else {
            document.getElementById('timerDisplay').textContent = "Meeting Over";
        }
    }

    function initializeJitsi(roomName) {
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
        document.getElementById('roomForm').style.display = 'none';
        document.getElementById('shareSession').style.display = 'inline-block';
    }

    var roomForm = document.getElementById('roomForm');
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var roomName = document.getElementById('roomName').value.trim();
        if (roomName) {
            initializeJitsi(roomName);
        } else {
            alert('Please enter a room name.');
        }
    });

    document.getElementById('shareSession').addEventListener('click', function() {
        var roomName = document.getElementById('roomName').value.trim();
        var shareURL = window.location.href.split('?')[0] + '?room=' + encodeURIComponent(roomName);
        
        navigator.clipboard.writeText(shareURL).then(function() {
            alert('Link copied to clipboard! Share it with others to join your Palooka session.');
        }).catch(function(err) {
            alert('Failed to copy link: ', err);
        });
    });

    var urlParams = new URLSearchParams(window.location.search);
    var roomNameFromURL = urlParams.get('room');
    if(roomNameFromURL) {
        document.getElementById('roomName').value = roomNameFromURL;
        initializeJitsi(roomNameFromURL);
    }
});
