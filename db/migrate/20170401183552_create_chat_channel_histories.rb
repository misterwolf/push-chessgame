
# info for all messages that users sent each other ordering by time.

class CreateChatChannelHistories < ActiveRecord::Migration
  def change
    create_table :chat_channel_histories do |t|
    t.integer   :chat_id,   null: false
    t.string    :message
    t.boolean   :received,  default: false
    t.datetime  :sent_on
    t.datetime  :read_on

    t.timestamps null: false
    end
  end
end
