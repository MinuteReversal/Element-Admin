<%@ WebHandler Language="C#" Class="Upload" %>

using System;
using System.Web;

public class Upload : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        HttpPostedFile file = context.Request.Files[0];
        string name = string.Concat(Guid.NewGuid().ToString(), System.IO.Path.GetExtension(file.FileName));
        file.SaveAs(string.Concat(context.Server.MapPath("./Upload/"), name));
        context.Response.ContentType = "application/json";
        context.Response.Write(string.Format(@"{{""Data"":""{0}""}}", name));
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}