class ChatController < ApplicationController

  def create
    task = Chat.new message
    if task.save
      send_message :create_success, task, :namespace => :tasks
    else
      send_message :create_fail, task, :namespace => :tasks
    end
  end

  def update
    # TO DO
  end

end
