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
        // ... (existing logic for handling topics)
    }

    function initializeJitsi(roomName) {
        // ... (existing logic for initializing Jitsi Meet)
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
