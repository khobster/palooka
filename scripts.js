document.addEventListener('DOMContentLoaded', function () {
    var topics = [];
    var currentTopicIndex = 0;
    var bellSound = new Audio('https://www.vanillafrosting.agency/wp-content/uploads/2023/11/bell.mp3');

    // ... (rest of your existing code)

    // Handling the room creation form
    var roomForm = document.getElementById('roomForm');
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var roomName = document.getElementById('roomName').value.trim();
        if (roomName) {
            // ... (existing room setup code)
            
            // Show the share button
            document.getElementById('shareSession').style.display = 'inline-block';
        } else {
            alert('Please enter a room name.'); // Alert the user to enter a room name
        }
    });

    // Share session link button event listener
    document.getElementById('shareSession').addEventListener('click', function() {
        var roomName = document.getElementById('roomName').value.trim();
        var shareURL = window.location.href.split('?')[0] + '?room=' + encodeURIComponent(roomName);
        
        // Copy the link to clipboard
        navigator.clipboard.writeText(shareURL).then(function() {
            alert('Link copied to clipboard! Share it with others to join your Palooka session.');
        }).catch(function(err) {
            alert('Failed to copy link: ', err);
        });
    });

    // Auto-join the room if the room name is provided in the URL
    var urlParams = new URLSearchParams(window.location.search);
    var roomNameFromURL = urlParams.get('room');
    if(roomNameFromURL) {
        document.getElementById('roomName').value = roomNameFromURL;
        document.getElementById('roomForm').dispatchEvent(new Event('submit'));
    }
});
