# FIRST SET OF chatChannel
class CreateChatChannelTable < ActiveRecord::Migration
  def change
    create_table :chat_channel_tables do |t|

      t.string    :name,            unique: true
      t.integer   :user_requester_id,  null: false
      t.integer   :user_acceptor_id,   null: false
      t.boolean   :user_requester_window_open,   default: true
      t.boolean   :user_acceptor_window_open,    default: true
      t.boolean   :blocked,                      default: false

      t.timestamps null: false
    end
  end
end
