using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ElectronicSchem.Models.ElectronicSchemModels.Posts;
using ElectronicSchem.Models;
using Json;
using System.Web.Script.Serialization;
using ElectronicSchem.Models.ElectronicSchemModels.Schems;
using ElectronicSchem.Models.ElectronicSchemModels.Components;
using ElectronicSchem.Models.ViewModels;
using ElectronicSchem.Models.ElectronicSchemModels.Comments;
using ElectronicSchem.Models.ElectronicSchemModels;
using CloudinaryDotNet;
using ElectronicSchem.Models.ElectronicSchemModels.Tops;

namespace ElectronicSchem.Controllers
{
    public class PostsController : Controller
    {
        public ApplicationDbContext databaseContext = new ApplicationDbContext();

        public const int CountTopPosts = 5;


        [HttpPost]
        public string AllPosts(string text)
        {
            var posts = LuceneSearch.SearchPosts(text);
            var result = new List<PostViewModel>();

            foreach (PostModel post in posts)
            {
                var postModel = databaseContext.Posts.FirstOrDefault(x => x.ID == post.ID);

                var postView = new PostViewModel(postModel, databaseContext.Categories.FirstOrDefault(x => x.ID == postModel.CategoryId));

                postView.username = databaseContext.Users.FirstOrDefault(x => x.Id == postModel.UserID).UserName;

                result.Add(postView);
            }

            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        public string GetTagsByPattern(string pattern)
        {
            var tagsList = databaseContext.Tags.Where(tag => tag.Value.IndexOf(pattern) > -1).ToArray();
            var result = new List<TagViewModel>();

            foreach (TagModel tag in tagsList)
                result.Add(new TagViewModel(tag));

            return new JavaScriptSerializer().Serialize(result.ToArray());
        }

        public ActionResult Index(long? id)
        {
            ViewBag.Languages = GetLanguage();
            ViewBag.UserMute = GetCurrentUser()?.isMuted;

            if (id == null)
                return RedirectToAction("AllPosts", databaseContext.Posts.All(x => true));

            PostModel post = databaseContext.Posts.FirstOrDefault(x => x.ID == id);

            if (post == null)
                return Redirect("/Errors/NotFound");

            ViewBag.editMode = false;
            ViewBag.currentPostId = post.ID;
            ViewBag.Category = GetTextFromResourceByKey(databaseContext.Categories.FirstOrDefault(x => x.ID == post.CategoryId).Name);

            return View(post);
        }

        [HttpPost]
        public long LikePost(long postId)
        {
            var likes = GetLikesByPostID(postId);

            if (GetCurrentUser() == null)
                return likes.Count(x => x.isLike);

            if (likes.FirstOrDefault(x => x.User.Id == GetCurrentUser().Id) == null)
                AddLikeInPost(postId, true);

            return GetLikesByPostID(postId).Count(x => x.isLike);
        }


        [HttpPost]
        public long DislikePost(long postId)
        {
            var likes = GetLikesByPostID(postId);

            if (GetCurrentUser() == null)
                return likes.Count(x => !x.isLike);

            if (likes.FirstOrDefault(x => x.User.Id == GetCurrentUser().Id) == null)
                AddLikeInPost(postId, false);

            return GetLikesByPostID(postId).Count(x => !x.isLike);
        }


        [HttpPost]
        public long LikeComments(long commentId)
        {
            var likes = GetLikesByCommentID(commentId);

            if (GetCurrentUser() == null)
                return likes.Count(x => x.isLike);

            if (likes.FirstOrDefault(x => x.User.Id == GetCurrentUser().Id) == null)
                AddLikeInComment(commentId, true);

            return likes.Count(x => x.isLike);
        }


        [HttpPost]
        public long DislikeComments(long commentId)
        {
            var likes = GetLikesByCommentID(commentId);

            if (GetCurrentUser() == null)
                return likes.Count(x => !x.isLike);

            if (likes.FirstOrDefault(x => x.User.Id == GetCurrentUser().Id) == null)
                AddLikeInComment(commentId, false);

            return likes.Count(x => !x.isLike);
        }



        [HttpPost]
        public long GetLikesPost(long postId)
        {
            var likes = GetLikesByPostID(postId);

            return likes.Count(x => x.isLike);
        }

        [HttpPost]
        public long GetDislikesPost(long postId)
        {
            var likes = GetLikesByPostID(postId);

            return likes.Count(x => !x.isLike);
        }

        [HttpPost]
        public long GetLikesComments(long commentId)
        {
            var likes = GetLikesByCommentID(commentId);

            return likes.Count(x => x.isLike);
        }

        [HttpPost]
        public long GetDislikesComments(long commentId)
        {
            var likes = GetLikesByCommentID(commentId);

            return likes.Count(x => !x.isLike);
        }

        [HttpPost]
        [Authorize]
        public long CreatePost(string post, string category)
        {
            PostModel obj = new JavaScriptSerializer().Deserialize<PostModel>(post);

            obj.DatePost = DateTime.Now;
            obj.UserID = GetCurrentUser()?.Id;
            obj = databaseContext.Posts.Add(obj);
            obj.CategoryId = GetCategotyByName(category)?.ID ?? databaseContext.Categories.First().ID;

            databaseContext.SaveChanges();

            LuceneSearch.AddPostToLuceneIndex(obj);

            GetMedalForSchem("medal4_uxccou.png", "FirstPost", 1, obj.UserID);
            GetMedalForSchem("medal5_yhpzoc.png", "ThirdPost", 3, obj.UserID);
            GetMedalForSchem("medal6_v1yuuy.png", "TensPost", 10, obj.UserID);

            return obj.ID;
        }

        [HttpPost]
        [Authorize]
        public void RemovePost(long postId)
        {
            PostModel oldPost = databaseContext.Posts.FirstOrDefault(x => x.ID == postId);

            RemoveAllFromPost(oldPost.ID);
            RemovePostComments(postId);

            databaseContext.Posts.Remove(oldPost);

            databaseContext.SaveChanges();
            LuceneSearch.ClearLuceneIndexRecord(oldPost.ID);
        }

        [HttpPost]
        [Authorize]
        public long SavePost(long postId, string post, string category)
        {
            PostModel newPost = new JavaScriptSerializer().Deserialize<PostModel>(post);
            PostModel oldPost = databaseContext.Posts.FirstOrDefault(x => x.ID == postId);

            newPost.UserID = oldPost.UserID;
            newPost.ID = oldPost.ID;
            newPost.DatePost = oldPost.DatePost;

            newPost.CategoryId = GetCategotyByName(category)?.ID ?? databaseContext.Categories.First().ID;

            EditPost(newPost, oldPost);
            LuceneSearch.AddPostToLuceneIndex(newPost);

            return oldPost.ID;
        }

        [HttpPost]
        [Authorize]
        public string SaveComment(string message, long postId)
        {
            PostModel oldPost = databaseContext.Posts.FirstOrDefault(x => x.ID == postId);

            CommentModel comment = new CommentModel();
            comment.Text = message;
            comment.User = GetCurrentUser();
            comment.DateComment = DateTime.Now;

            comment = AddCommentToPost(comment, oldPost);

            databaseContext.SaveChanges();

            GetMedalForComments("medal1_ekrf1s.png", "FirstComment", 1, GetCurrentUser().Id);
            GetMedalForComments("medal2_z2nau0.png", "TensComment", 10, GetCurrentUser().Id);
            GetMedalForComments("medal3_ujupxl.png", "ThirtiethComment", 30, GetCurrentUser().Id);

            return new JavaScriptSerializer().Serialize(CommentToJsonObject(comment));
        }

        [HttpPost]
        public string GetComments(long postId, int beginIndex, int count)
        {
            List<object> result = new List<object>();

            var Comments = GetCommentByPostID(postId);
            Comments = Comments.OrderByDescending(x => x.DateComment).ToArray();

            for (int i = beginIndex; i < beginIndex + count; i++)
                if (i >= 0 && i < Comments.Length)
                    result.Add(CommentToJsonObject(Comments[i]));

            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        [Authorize]
        public string GetUserPosts(string userId)
        {
            var posts = databaseContext.Posts.Where(x => x.UserID == userId).ToArray();

            List<PostViewModel> result = new List<PostViewModel>();

            foreach (PostModel post in posts)
            {
                var p = new PostViewModel(post, databaseContext.Categories.FirstOrDefault(x => x.ID == post.CategoryId));
                p.datetime = post.DatePost;
                p.rating = GetLikesByPostID(post.ID).Count(x => x.isLike) - GetLikesByPostID(post.ID).Count(x => !x.isLike);
                result.Add(p);
                result[result.Count - 1].username = databaseContext.Users.FirstOrDefault(x => x.Id == post.UserID).UserName;
            }

            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        public string GetPostsByTag(string tag)
        {
            var posts = databaseContext.Tags.Where(x => x.Value == tag).Select(y => y.Post);

            List<PostViewModel> result = new List<PostViewModel>();

            foreach (PostModel post in posts)
            {
                var p = new PostViewModel(post, new ApplicationDbContext().Categories.FirstOrDefault(x => x.ID == post.CategoryId));
                p.datetime = post.DatePost;
                p.rating = GetLikesByPostIDNewContext(post.ID).Count(x => x.isLike) - GetLikesByPostIDNewContext(post.ID).Count(x => !x.isLike);
                result.Add(p);
                result[result.Count - 1].username = new ApplicationDbContext().Users.FirstOrDefault(x => x.Id == post.UserID).UserName;
            }

            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        public string TopPosts()
        {
            var posts = GetTopsModel();

            var result = new List<PostViewModel>();

            for (int i = posts.Count - 1; i > posts.Count - 1 - CountTopPosts; i--)
            {
                var p = new PostViewModel(posts[i].Post, new CategoryModel());
                p.datetime = posts[i].Post.DatePost;
                p.rating = GetLikesByPostIDNewContext(posts[i].Post.ID).Count(x => x.isLike) - GetLikesByPostIDNewContext(posts[i].Post.ID).Count(x => !x.isLike);
                result.Add(p);
                var userid = posts[i].Post.UserID;
                result[result.Count - 1].username = new ApplicationDbContext().Users.FirstOrDefault(x => x.Id == userid).UserName;
            }


            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        public string GetPostsByCategory(string category)
        {
            long idCategory = GetIdCategory(category);

            var posts = databaseContext.Posts.Where(x => x.CategoryId == idCategory);

            List<PostViewModel> result = new List<PostViewModel>();

            foreach (PostModel post in posts)
            {
                var p = new PostViewModel(post, new ApplicationDbContext().Categories.FirstOrDefault(x => x.ID == post.CategoryId));
                p.datetime = post.DatePost;
                p.rating = GetLikesByPostIDNewContext(post.ID).Count(x => x.isLike) - GetLikesByPostIDNewContext(post.ID).Count(x => !x.isLike);
                result.Add(p);
                result[result.Count - 1].username = new ApplicationDbContext().Users.FirstOrDefault(x => x.Id == post.UserID).UserName;
            }

            return new JavaScriptSerializer().Serialize(result);
        }

        [HttpPost]
        public string GetMedalsUser(string userId)
        {
            var result = new List<MedalViewModel>();

            var userMedals = GetMedalsByUserID(userId);

            foreach (Medal medal in userMedals)
            {
                medal.Description = GetTextFromResourceByKey(medal.Description);
                result.Add(new MedalViewModel(medal));
            }


            return new JavaScriptSerializer().Serialize(result);
        }

        [NonAction]
        public static string GetUserNickNameByID(string userId)
        {
            return new ApplicationDbContext().Users.FirstOrDefault(x => x.Id == userId).UserName;
        }

        [HttpPost]
        public string GetSchem(long? id)
        {
            if (id == null)
                return "";

            PostModel post = databaseContext.Posts.FirstOrDefault(x => x.ID == id);


            if (post == null)
                return "";

            return new JavaScriptSerializer().Serialize(new {
                components = GetViewComponentsByPostID(post.ID),
                wires = GetViewWiresByPostID(post.ID),
                tags = GetViewTagsByPostID(post.ID)
            });
        }

        [Authorize]
        public ActionResult MangePost(long? id)
        {
            ViewBag.Languages = GetLanguage();

            if (GetCurrentUser()?.isMuted == true || GetCurrentUser()?.isMuted == null)
                return Redirect("/Home");

            PostModel post = databaseContext.Posts.FirstOrDefault(x => x.ID == id);


            SetViewBagOnManagePost(post);
            return View(post);
        }


        [HttpPost]
        public string GetTags()
        {
            var taglist = databaseContext.Tags.Select(x => new { value = x.Value, id = x.ID }).ToArray();

            return new JavaScriptSerializer().Serialize(taglist);
        }

        #region Helpers

        private void AddLikeInPost(long postId, bool isLike)
        {
            LikeModel like = new LikeModel();

            like.Post = databaseContext.Posts.FirstOrDefault(x => x.ID == postId);
            like.User = GetCurrentUser();
            like.isLike = isLike;

            databaseContext.Likes.Add(like);
            databaseContext.SaveChanges();
        }

        private void AddLikeInComment(long commentId, bool isLike)
        {
            LikeModel like = new LikeModel();

            like.Comment = databaseContext.Comments.FirstOrDefault(x => x.ID == commentId);
            like.User = GetCurrentUser();
            like.isLike = isLike;

            databaseContext.Likes.Add(like);
            databaseContext.SaveChanges();
        }

        private List<TopPostModel> GetTopsModel()
        {
            var posts = new List<TopPostModel>();

            foreach (PostModel post in databaseContext.Posts.Select(x => x))
            {
                var likes = GetLikesByPostIDNewContext(post.ID);
                posts.Add(new TopPostModel() { Post = post, Rating = likes.Count(x => x.isLike) - likes.Count(x => !x.isLike) });
            }

            posts.Sort(TopPostModel.ComparerByRating);

            return posts;
        }

        private int PostsLikes(long postId, bool likes)
        {
            return databaseContext.Likes.Count(x => x.Post.ID == postId && x.isLike == likes);
        }

        private long GetIdCategory(string category)
        {
            var categorise = new ApplicationDbContext().Categories.Select(x => x).ToList();

            for (int i = 0; i < categorise.Count; i++)
                if (GetTextFromResourceByKey(categorise[i].Name) == category)
                    return categorise[i].ID;

            return -1;
        }

        private void GetMedalForSchem(string idImg, string desc, int countSchem, string userId)
        {
            if (databaseContext.Posts.Count(x => x.UserID == userId) >= countSchem &&
                databaseContext.Medals.FirstOrDefault(x => x.User.Id == userId && x.Description == desc) == null)
                databaseContext.Medals.Add(CreateMedal(idImg, desc));

            databaseContext.SaveChanges();
        }

        private void GetMedalForComments(string idImg, string desc, int countComments, string userId)
        {
            if (databaseContext.Comments.Count(x => x.User.Id == userId) >= countComments &&
                databaseContext.Medals.FirstOrDefault(x => x.User.Id == userId && x.Description == desc) == null)
                databaseContext.Medals.Add(CreateMedal(idImg, desc));

            databaseContext.SaveChanges();
        }

        private Medal CreateMedal(string idImg, string desc)
        {
            Account account = new Account(
                 "alexeymaslovskicloud",
                 "344197536716973",
                 "A73t_G_1M7mahpdkQ6YLQqJCo_U");

            Cloudinary cloudinary = new Cloudinary(account);

            return new Medal() { Description = desc, Url = cloudinary.Api.UrlImgUp.BuildUrl(idImg), User = GetCurrentUser() };
        }

        private void RemoveAllFromPost(long postId)
        {
            RemovePostComponents(postId);

            databaseContext.Components.RemoveRange(GetComponentsByPostID(postId));

            RemovePostWires(postId);
            RemovePostTags(postId);
            RemovePostLikes(postId);
        }

        private void RemovePostLikes(long postId)
        {
            foreach (LikeModel like in GetLikesByPostID(postId))
            {
                databaseContext.Likes.Attach(like);
                databaseContext.Entry(like).State = System.Data.Entity.EntityState.Deleted;
            }
        }

        private void SetViewBagOnManagePost(PostModel post)
        {
            string[] idCategories = new ApplicationDbContext().Categories.Select(x => x.Name).ToArray();
            ViewBag.Categories = idCategories.Select(x => GetTextFromResourceByKey(x));

            if (post != null)
                ViewBag.CurCategory = GetTextFromResourceByKey(databaseContext.Categories.FirstOrDefault(x => x.ID == post.CategoryId).Name);

            ViewBag.editMode = true;
            ViewBag.currentPostId = post?.ID;
        }

        private void EditPost(PostModel newPost, PostModel oldPost)
        {
            oldPost.Title = newPost.Title;
            oldPost.Discription = newPost.Discription;
            oldPost.CategoryId = newPost.CategoryId;
            RemoveAllFromPost(oldPost.ID);

            AddComponentsToPost(newPost, oldPost);

            AddoWiresToPost(newPost, oldPost);
            AddoTagsToPost(newPost, oldPost);

            databaseContext.SaveChanges();
        }

        private object CommentToJsonObject(CommentModel comment)
        {
            return new {
                text = comment.Text,
                user = comment.User?.UserName ?? "Noname",
                date = comment.DateComment.ToString(),
                id = comment.ID,
                userId = comment.User.Id
            };
        }

        private ApplicationUser GetCurrentUser()
        {
            ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext()
                  .GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());

            if (user != null)
                return databaseContext.Users.FirstOrDefault(x => x.Id == user.Id);
            else
                return null;
        }

        private void RemovePostWires(long postId)
        {
            foreach (WireModel wire in GetWiresByPostID(postId))
            {
                databaseContext.Wires.Attach(wire);
                databaseContext.Entry(wire).State = System.Data.Entity.EntityState.Deleted;
            }
        }

        private void RemovePostTags(long postId)
        {
            foreach (TagModel tag in GetTagsByPostID(postId))
            {
                databaseContext.Tags.Attach(tag);
                databaseContext.Entry(tag).State = System.Data.Entity.EntityState.Deleted;
            }
        }

        private void RemovePostComments(long postId)
        {
            foreach (CommentModel tag in GetCommentByPostID(postId))
            {
                databaseContext.Comments.Attach(tag);
                databaseContext.Entry(tag).State = System.Data.Entity.EntityState.Deleted;
            }
        }

        private void AddoWiresToPost(PostModel newPost, PostModel oldPost)
        {
            foreach (WireModel wire in newPost.Wires)
            {
                wire.Post = oldPost;
                databaseContext.Wires.Add(wire);
            }
        }

        private void AddoTagsToPost(PostModel newPost, PostModel oldPost)
        {
            foreach (TagModel tag in newPost.Tags)
            {
                tag.Post = oldPost;
                databaseContext.Tags.Add(tag);
            }
        }

        private void AddComponentsToPost(PostModel newPost, PostModel oldPost)
        {
            foreach (ComponentModel component in newPost.Components)
            {
                component.Post = oldPost;

                AddReferencesToInputs(component.Inputs, component);

                AddReferencesToProperties(component.Properties, component);

                databaseContext.Components.Add(component);
            }
        }

        private CommentModel AddCommentToPost(CommentModel comment, PostModel oldPost)
        {
            comment.Post = oldPost;

            return databaseContext.Comments.Add(comment);
        }

        private void AddReferencesToInputs(ICollection<InputModel> inputs, ComponentModel component)
        {
            foreach (InputModel input in inputs)
                input.Component = component;
        }

        private void AddReferencesToProperties(ICollection<PropertyModel> properties, ComponentModel component)
        {
            foreach (PropertyModel property in properties)
            {
                if (property.Items != null)
                    foreach (PropertyItemsModel item in property.Items)
                        item.Property = property;

                property.Component = component;
            }
        }

        private void RemovePostComponents(long postId)
        {
            foreach (ComponentModel component in GetComponentsByPostID(postId))
            {
                databaseContext.Inputs.RemoveRange(component.Inputs);

                foreach (PropertyModel property in component.Properties)
                    databaseContext.PropertiesElements.RemoveRange(property.Items);

                databaseContext.Proprties.RemoveRange(component.Properties);
            }
        }

        private ComponentViewModel[] GetViewComponentsByPostID(long postId)
        {
            var components = GetComponentsByPostID(postId);

            var result = new List<ComponentViewModel>();

            for (int i = 0; i < components.Length; i++)
                result.Add(new ComponentViewModel(components[i]));

            return result.ToArray();
        }

        private WireViewModel[] GetViewWiresByPostID(long postId)
        {
            var wires = GetWiresByPostID(postId);

            var result = new List<WireViewModel>();

            for (int i = 0; i < wires.Length; i++)
                result.Add(new WireViewModel(wires[i]));

            return result.ToArray();
        }

        private TagViewModel[] GetViewTagsByPostID(long postId)
        {
            var tags = GetTagsByPostID(postId);

            var result = new List<TagViewModel>();

            for (int i = 0; i < tags.Length; i++)
                result.Add(new TagViewModel(tags[i]));

            return result.ToArray();
        }

        private ComponentModel[] GetComponentsByPostID(long postId)
        {
            return databaseContext.Components.Where(x => x.Post.ID == postId).ToArray();
        }

        private CommentModel[] GetCommentByPostID(long postId)
        {
            return databaseContext.Comments.Where(x => x.Post.ID == postId).ToArray();
        }

        private LikeModel[] GetLikesByPostID(long postId)
        {
            return databaseContext.Likes.Where(x => x.Post.ID == postId).ToArray();
        }

        private LikeModel[] GetLikesByPostIDNewContext(long postId)
        {
            return new ApplicationDbContext().Likes.Where(x => x.Post.ID == postId).ToArray();
        }

        private LikeModel[] GetLikesByCommentID(long commentId)
        {
            return databaseContext.Likes.Where(x => x.Comment.ID == commentId).ToArray();
        }

        private WireModel[] GetWiresByPostID(long postId)
        {
            return databaseContext.Wires.Where(x => x.Post.ID == postId).ToArray();
        }

        private TagModel[] GetTagsByPostID(long postId)
        {
            return databaseContext.Tags.Where(x => x.Post.ID == postId).ToArray();
        }

        private Medal[] GetMedalsByUserID(string userId)
        {
            return databaseContext.Medals.Where(x => x.User.Id == userId).ToArray();
        }

        private CategoryModel GetCategotyByName(string category)
        {
            var categoriesKeys = new ApplicationDbContext().Categories.Select(x => x);

            foreach (CategoryModel x in categoriesKeys)
                if (GetTextFromResourceByKey(x.Name) == category)
                    return x;

            return null;
        }

        private string GetLanguage()
        {
            return string.IsNullOrEmpty(HttpContext.Request.Cookies.Get("language")?.Value) ? "En" : HttpContext.Request.Cookies.Get("language").Value;
        }

        private string GetTextFromResourceByKey(string key)
        {
            if (GetLanguage() == "Ru")
                return Properties.ResourcesRu.ResourceManager.GetString(key);
            else
                return Properties.ResourcesEn.ResourceManager.GetString(key);
        }


        #endregion
    }
}
