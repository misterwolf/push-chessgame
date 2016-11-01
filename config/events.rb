WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.

  # The :new_client_connected method is fired automatically when a new client connects
  #SUBSCRIBE :CHANNEL, TO => CONTROLLER, WITH_METHOD => CONTROLLER_ACTION


  # there is not need to specify subscerition for channels
  #
  # namespace :websocket_rails do
  #   subscribe :new_client_connected,  :to => SocketController, :with_method => :new_client_connected
  #   subscribe :get_all_clients,       :to => SocketController, :with_method => :get_all_clients
  #   # The :client_disconnected method is fired automatically when a client disconnects
  #   subscribe :client_disconnected,   :to => SocketController, :with_method => :client_disconnected
  # end
end
