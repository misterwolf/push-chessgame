class PlayController < ApplicationController
  protect_from_forgery with: :exception

  before_filter :authenticate_user!

  def index
  end

  def get_all_clients
    users = WebsocketRails.users.users.map { |user,websocket| user }
    users = User.where(id: users) # .map{ |user| {id: user.id, name: user.name}}
    logger.info(users)

    respond_to do |format|
      format.html {
        render :json => {:error => "none", :users => users.to_json}
      }
      format.json { # This block will be called for JSON requests
        render :json => {:error => "none", :msg => users.to_json}
      }
    end
  end

end
