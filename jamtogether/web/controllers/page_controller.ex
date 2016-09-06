defmodule Jamtogether.PageController do
  use Jamtogether.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
