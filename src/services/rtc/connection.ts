const servers = {
	iceServers: [
		{
			urls: [
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
			],
		},
	],
	iceCandidatePoolSize: 10,
};

class PeerConnection {
	_peerConnection: RTCPeerConnection | null = null;

	public peerConnection(): RTCPeerConnection {
		if (this._peerConnection == null) {
			this._peerConnection = new RTCPeerConnection(servers);
		}
		return this._peerConnection;
	}
}

const _ = new PeerConnection();

const getPeerConnection = _.peerConnection.bind(_);

export default getPeerConnection;
