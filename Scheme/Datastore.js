const { Schema, model } = require('mongoose');

const DatastoreSchema = new Schema({
	guild_id: String,
    channel_id: String,
});

module.exports = model("log_channels", DatastoreSchema);
