require 'rails_helper'

# ANYTHING DOESN'T START RSPEC FOR THESE TESTS.
# I TRYIED TO CHANGE SOME GEM FILE AS SUGGESTED HERE:
# https://github.com/depili/websocket-rails/commit/5b010567bc13ba759c6945709d84517762b60b6a
# BUT NOTHING.
# LIB/WEBSOCKET_RAILS/DISPATCHER.RB :
#  unless Rails.env.test?
 # +          EM.next_tick { action.resume }
 # +        else
 # +          # In tests we need to process the actions immediately.
 # +          action.resume
 # +        end

RSpec.describe WebsocketRails::EventMap do

  describe 'Event Mapping for ChessGame' do

    describe 'socket.new_client_connected' do

      # create_event's result is very different from be_routed_only_to's result.
      it 'should be routed correctly' do
        create_event('socket.new_client_connected', nil).should be_routed_only_to 'socket#new_client_connected'
      end

      # it "should trigger any message" do
      #   event = create_event("socket.new_client_connected", :data => "some")
      #   expect(event.dispatch).to trigger_success_message :any
      # end
      #
      # it 'should trigger a success message on product.update' do
      #  create_event('product.update', nil).dispatch.should trigger_success_message
      # end

    end

    # describe 'socket.get_all_clients' do
    #
    #   it 'should be routed correctly' do
    #     # feel free to split the should statements into separate examples, not done here for brevity's sake
    #     create_event('socket.get_all_clients', nil).should be_routed_to 'socket#get_all_clients'
    #   end
    #
    # end
    #
    # describe 'socket.client_disconnected' do
    #
    #   it 'should be routed correctly' do
    #     # feel free to split the should statements into separate examples, not done here for brevity's sake
    #     create_event('socket.client_disconnected', nil).should be_routed_to 'socket#get_all_clients'
    #   end
    #
    # end

  end

end
