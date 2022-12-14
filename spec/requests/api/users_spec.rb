require 'rails_helper'

RSpec.describe "Api::Users", type: :request do

  describe "GET /api/users" do
    let!(:alice){User.create!(name: 'Alice Alisson', username: 'alice@email.com', password: "sosecure")}
    let!(:bob){User.create!(name: 'Bob Bobson', username: 'bob@email.com', password: "sosecure")}

    it "returns an array of users" do
      get '/api/users'
      expect(response.body).to include_json([
                                              {
                                                id: alice.id,
                                                name: alice.name,
                                                username: alice.username
                                              },
                                              {
                                                id: bob.id,
                                                name: bob.name,
                                                username: bob.username
                                              }
                                            ])
    end
    #...
  end


  describe "GET /api/users/:id" do
    let!(:user_params){User.create!(name: 'Alice Alisson', username: 'alice@email.com', password: "sosecure")}

    it "returns a user by id" do
      # post '/api/login', params: user_params
      get "/api/users/#{user_params.id}"
      expect(response.body).to include_json({
                                              id: user_params.id,
                                              name: user_params.name,
                                              username: user_params.username
                                            })
    end

  end



  describe "POST /api/signup" do
    context "with valid user params" do
      let!(:user_params) {
        {
          name: 'Bob B',
          username: 'bob@email.com',
          password: 'sosafe'
        }
      }

      it 'creates a new user' do
        expect { post '/api/signup', params: user_params }.to change(User, :count).by(1)
      end

      it "saves the password as password_digest to allow authentication" do
        post "/api/signup", params: user_params

        expect(User.last.authenticate(user_params[:password])).to eq(User.last)
      end

      it 'returns the user data' do
        post '/api/signup', params: user_params

        expect(response.body).to include_json({
                                                id: a_kind_of(Integer),
                                                name: 'Bob B',
                                                username: 'bob@email.com'
                                              })
      end

      it "sets the user ID in the session" do
        post '/api/signup', params: user_params

        expect(session[:user_id]).to eq(JSON.parse(response.body)["id"])
      end

      it 'returns a status code of 201 (created)' do
        post '/api/signup', params: user_params

        expect(response).to have_http_status(:created)
      end


    end

    context "with invalid user params" do
      let!(:user_params) { { email: 'joe@schmoe.com' } }

      it 'does not create a new user' do
        expect { post '/api/signup', params: user_params }.to change(User, :count).by(0)
      end


      it 'returns a status code of 422 (Unprocessable Entity)' do
        post '/api/signup', params: user_params

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end


  describe "UPDATE /api/users/:id" do
    let!(:user){User.create!(name: 'Alice Alisson', username: 'alice@email.com', password: "sosecure")}
    let!(:update_params) { { name: "Alice Bobson" } }

    it "updates the user with the matching id" do
      expect(User.find(user.id).id).to eql(user.id)
      patch "/api/users/#{user.id}", params: update_params
      expect(User.find_by_name("Alice Bobson")).to eql(user)


    end
  end

  describe "DELETE /api/users/:id" do
    let!(:user){User.create!(name: 'Alice Alisson', username: 'alice@email.com', password: "sosecure")}

    it "deletes the user with the matching id" do
      expect(User.find(user.id).id).to eql(user.id)
      delete "/api/users/#{user.id}"
      expect(User.find_by_id(user.id)).to be_nil
      # expect { delete "/api/users/#{user.id}" }.to change(User, :count).by(-1)
    end

  end


end
