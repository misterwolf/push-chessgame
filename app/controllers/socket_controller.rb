class SocketController < WebsocketRails::BaseController

  # FIRST SET UP OF COMMUNICATION WITH CLIENT.
  # NEED TO CHANGE STRUCTURE IN FUTURE.
  def response_message(params)
    hash = {
        content: params['content'],
        error: params['error'],
        action: params['action'],
        controller: 'socket'
    }
    hash
  end

  def initialize_session
    # perform application setup here
    puts 'initialize_session'
    controller_store[:message_count] = 0
  end

  def new_client_connected
    begin
      puts 'new_client_connected'
      params['action'] = 'new_client_connected'
      params['content'] = [['id'=>current_user.id,'email'=> current_user.email]]
      WebsocketRails[:new_client_connected].trigger 'new_client_connected', response_message(params)
    rescue Exception => e
      params['action'] = 'new_client_connected'
      params['error'] = {'exist' => 1,'log' => e}
      WebsocketRails[:new_client_connected].trigger 'new_client_connected', response_message(params)
    end
  end

  def get_all_clients #for each client this method will be called once a time.
    users = WebsocketRails.users.users
    # i can't pass WebsocketRails.users directly to client. I have to map only the ids. why?
    # it is better: let's pass less info to client.
    begin
      # remove current user.
      # what is the users will become 971297847 ? uhm, can we set a limit for channel?
      users_mapped = users.reject{ |user| user == current_user.id.to_s }.map { |user,websocket| user }
      params['action'] = 'get_all_clients'
      params['content'] = User.find(users_mapped).map{|user| ['id'=>user.id, 'email'=> user.email]}
      WebsocketRails[:get_all_clients].trigger 'get_all_clients', response_message(params)
    rescue Exception => e
      params['action'] = 'get_all_clients'
      params['error'] = {'exist' => 1,'log' => e}
      WebsocketRails[:get_all_clients].trigger 'get_all_clients', response_message(params)
    end
  end

  def client_disconnected
    begin
      params['action'] = 'client_disconnected'
      params['content'] = [['id'=>current_user.id,'email'=> current_user.email]]
      WebsocketRails[:client_disconnected].trigger 'client_disconnected', response_message(params)
    rescue Exception => e
      params['action'] = 'client_disconnected'
      params['error'] = {'exist' => 1,'log' => e}
      WebsocketRails[:client_disconnected].trigger 'client_disconnected', response_message(params)
    end
  end

end
