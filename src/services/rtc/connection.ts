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

	public get peerConnection(): RTCPeerConnection {
		if (this._peerConnection == null) {
			this._peerConnection = new RTCPeerConnection(servers);
		}
		return this._peerConnection;
	}
}

const _ = new PeerConnection();

const peerConnection = _.peerConnection;

export default peerConnection;
